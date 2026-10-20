#!/usr/bin/env python3
"""Read-only Linux inventory for the Chalamandra Magistral inverse rebalancing pilot.

This probe does not change system state, contact cloud APIs, read environment values,
inspect command-line arguments of processes, or initiate migrations/scaling actions.
"""
from __future__ import annotations

import argparse
import json
import os
import platform
import shutil
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

PROC = Path("/proc")
SYS = Path("/sys")


def read_text(path: Path, default: str = "") -> str:
    try:
        return path.read_text(encoding="utf-8", errors="replace").strip()
    except (OSError, PermissionError):
        return default


def parse_key_value_lines(text: str) -> dict[str, str]:
    result: dict[str, str] = {}
    for line in text.splitlines():
        if ":" in line:
            key, value = line.split(":", 1)
            result[key.strip()] = value.strip()
    return result


def parse_meminfo(text: str) -> dict[str, int]:
    result: dict[str, int] = {}
    for key, value in parse_key_value_lines(text).items():
        fields = value.split()
        if fields and fields[0].isdigit():
            amount = int(fields[0])
            result[key] = amount * 1024 if len(fields) > 1 and fields[1].lower() == "kb" else amount
    return result


def parse_psi(text: str) -> dict[str, dict[str, float | int]]:
    """Parse Linux PSI; total is microseconds, averages are percentage points."""
    result: dict[str, dict[str, float | int]] = {}
    for line in text.splitlines():
        fields = line.split()
        if not fields:
            continue
        row: dict[str, float | int] = {}
        for field in fields[1:]:
            if "=" not in field:
                continue
            key, value = field.split("=", 1)
            try:
                row[key] = int(value) if key == "total" else float(value)
            except ValueError:
                continue
        result[fields[0]] = row
    return result


def parse_zram_mm_stat(text: str) -> dict[str, Any] | None:
    fields = text.split()
    if len(fields) < 3:
        return None
    try:
        original, compressed, used = (int(fields[0]), int(fields[1]), int(fields[2]))
    except ValueError:
        return None
    return {
        "original_bytes": original,
        "compressed_bytes": compressed,
        "memory_used_bytes": used,
        "compression_ratio_original_over_compressed": round(original / compressed, 3) if compressed else None,
        "memory_saving_bytes_estimate": max(original - used, 0),
    }


def parse_limit(value: str) -> int | None:
    value = value.strip()
    if not value or value == "max":
        return None
    try:
        number = int(value)
        return number if number >= 0 else None
    except ValueError:
        return None


def safe_percent(numerator: int | None, denominator: int | None) -> float | None:
    if numerator is None or denominator is None or denominator <= 0:
        return None
    return round(100.0 * numerator / denominator, 2)


def distro_info() -> dict[str, str]:
    raw = parse_key_value_lines(read_text(Path("/etc/os-release")))
    return {key: raw[key].strip('"') for key in ("NAME", "ID", "VERSION_ID", "PRETTY_NAME") if key in raw}


def cgroup_memory() -> dict[str, Any]:
    """Read only cgroup memory counters, supporting common v2 and v1 layouts."""
    v2_root = Path("/sys/fs/cgroup")
    if (v2_root / "cgroup.controllers").exists():
        current = parse_limit(read_text(v2_root / "memory.current"))
        limit = parse_limit(read_text(v2_root / "memory.max"))
        swap_current = parse_limit(read_text(v2_root / "memory.swap.current"))
        swap_limit = parse_limit(read_text(v2_root / "memory.swap.max"))
        return {
            "version": "v2",
            "memory_current_bytes": current,
            "memory_limit_bytes": limit,
            "memory_limit_usage_percent": safe_percent(current, limit),
            "swap_current_bytes": swap_current,
            "swap_limit_bytes": swap_limit,
        }

    v1_root = Path("/sys/fs/cgroup/memory")
    if v1_root.exists():
        current = parse_limit(read_text(v1_root / "memory.usage_in_bytes"))
        limit = parse_limit(read_text(v1_root / "memory.limit_in_bytes"))
        # Some cgroup v1 kernels expose a huge sentinel for an unlimited limit.
        if limit is not None and limit >= (1 << 60):
            limit = None
        return {
            "version": "v1",
            "memory_current_bytes": current,
            "memory_limit_bytes": limit,
            "memory_limit_usage_percent": safe_percent(current, limit),
            "swap_current_bytes": None,
            "swap_limit_bytes": None,
        }

    return {"version": "unavailable", "memory_current_bytes": None, "memory_limit_bytes": None,
            "memory_limit_usage_percent": None, "swap_current_bytes": None, "swap_limit_bytes": None}


def zram_devices() -> list[dict[str, Any]]:
    rows = []
    for path in sorted((SYS / "block").glob("zram*")):
        mm_stat = parse_zram_mm_stat(read_text(path / "mm_stat"))
        rows.append({
            "device": path.name,
            "disksize_bytes": parse_limit(read_text(path / "disksize")),
            "mm_stat": mm_stat,
            "stat_available": bool(mm_stat),
        })
    return rows


def psi_snapshot() -> dict[str, Any]:
    result = {}
    for resource in ("cpu", "memory", "io"):
        raw = read_text(PROC / "pressure" / resource)
        result[resource] = parse_psi(raw) if raw else None
    return result


def psi_interval(before: dict[str, Any], after: dict[str, Any], elapsed_seconds: float) -> dict[str, Any]:
    result: dict[str, Any] = {"seconds": round(elapsed_seconds, 3), "resources": {}}
    for resource in ("cpu", "memory", "io"):
        row: dict[str, Any] = {}
        b_resource, a_resource = before.get(resource), after.get(resource)
        if isinstance(b_resource, dict) and isinstance(a_resource, dict):
            for mode in ("some", "full"):
                b_mode, a_mode = b_resource.get(mode), a_resource.get(mode)
                if not isinstance(b_mode, dict) or not isinstance(a_mode, dict):
                    continue
                b_total, a_total = b_mode.get("total"), a_mode.get("total")
                if isinstance(b_total, int) and isinstance(a_total, int) and a_total >= b_total:
                    stalled_us = a_total - b_total
                    row[mode] = {
                        "stalled_ms": round(stalled_us / 1000.0, 3),
                        "stall_percent_estimate": round(100.0 * stalled_us / (elapsed_seconds * 1_000_000), 3) if elapsed_seconds > 0 else None,
                    }
        result["resources"][resource] = row if row else None
    return result


def collect(interval_seconds: float = 1.0) -> dict[str, Any]:
    before = psi_snapshot()
    start = time.monotonic()
    time.sleep(interval_seconds)
    after = psi_snapshot()
    elapsed = time.monotonic() - start

    mem = parse_meminfo(read_text(PROC / "meminfo"))
    load = read_text(PROC / "loadavg").split()
    try:
        disk = shutil.disk_usage("/")
        disk_info = {"total_bytes": disk.total, "used_bytes": disk.used, "free_bytes": disk.free,
                     "used_percent": round(100 * disk.used / disk.total, 2) if disk.total else None}
    except OSError:
        disk_info = None

    tools = ("python3", "node", "npm", "gcloud", "az", "docker", "podman", "kubectl", "systemctl", "prometheus")
    proc_entries = list(PROC.iterdir()) if PROC.exists() else []
    process_count = sum(1 for p in proc_entries if p.name.isdigit())
    cgroup_path = read_text(PROC / "1" / "cgroup")
    container_indicators = []
    if Path("/.dockerenv").exists():
        container_indicators.append("dockerenv-marker")
    if Path("/run/.containerenv").exists():
        container_indicators.append("containerenv-marker")
    if "kubepods" in cgroup_path:
        container_indicators.append("kubepods-cgroup")
    if "docker" in cgroup_path:
        container_indicators.append("docker-cgroup")
    if "containerd" in cgroup_path:
        container_indicators.append("containerd-cgroup")

    root_mem = {key: mem.get(key) for key in ("MemTotal", "MemAvailable", "MemFree", "SwapTotal", "SwapFree", "Cached", "SReclaimable")}
    available_ratio = None
    if isinstance(root_mem["MemAvailable"], int) and isinstance(root_mem["MemTotal"], int) and root_mem["MemTotal"] > 0:
        available_ratio = round(100 * root_mem["MemAvailable"] / root_mem["MemTotal"], 2)

    return {
        "schema_version": "1.0",
        "generated_at_utc": datetime.now(timezone.utc).isoformat(),
        "mode": "read-only-observability",
        "actions_taken": [],
        "host": {
            "hostname": platform.node(),
            "os": distro_info(),
            "kernel_release": platform.release(),
            "architecture": platform.machine(),
            "python_version": platform.python_version(),
            "cpu_logical_count": os.cpu_count(),
            "load_average_1m_5m_15m": [float(v) for v in load[:3]] if len(load) >= 3 else None,
            "process_count_only": process_count,
            "container_indicators": container_indicators,
        },
        "memory": {
            "bytes": root_mem,
            "available_percent_of_total": available_ratio,
            "cgroup": cgroup_memory(),
            "zram": zram_devices(),
        },
        "pressure_stall_information": {
            "psi_current": after,
            "psi_interval_delta": psi_interval(before, after, elapsed),
            "note": "PSI totals are interval estimates from this host/container view; repeat during representative workload before setting alerts.",
        },
        "storage_root": disk_info,
        "tool_presence_only": {name: shutil.which(name) is not None for name in tools},
        "capability_limits": [
            "No cloud API calls were made.",
            "No Kubernetes cluster/node enumeration was attempted.",
            "No environment values, credentials, process command lines, or network addresses were collected.",
            "No migration, scaling, service restart, or power operation was performed.",
        ],
        "decision": {
            "rebalance_enabled": False,
            "recommendation": "Inventory only. Do not automate migration or scale-to-zero until the actual node pool, service SLOs, placement constraints, and cost data are independently verified.",
        },
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--interval-seconds", type=float, default=1.0, help="PSI sampling interval (0.1 to 10 seconds; default 1).")
    args = parser.parse_args()
    if not 0.1 <= args.interval_seconds <= 10.0:
        parser.error("--interval-seconds must be between 0.1 and 10")
    print(json.dumps(collect(args.interval_seconds), indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
