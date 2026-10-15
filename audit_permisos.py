import stat
import sys
from pathlib import Path


def audit_file_permissions(base_path: str) -> None:
    path = Path(base_path).expanduser()

    if not path.exists():
        print(f"[ERROR] La ruta no existe: {path}")
        return

    if not path.is_dir():
        print(f"[ERROR] La ruta no es un directorio: {path}")
        return

    root = path.resolve()
    print(f"=== AUDITORÍA DE PERMISOS: {root} ===\n")

    scanned = 0
    risky = 0
    errors = 0

    for item in root.rglob("*"):
        relative = item.relative_to(root)

        if any(
            part in {".git", "__pycache__"}
            for part in relative.parts
        ):
            continue

        try:
            mode = item.stat().st_mode
            permissions = stat.S_IMODE(mode)

            world_writable = bool(mode & stat.S_IWOTH)

            executable = (
                item.is_file()
                and bool(
                    mode
                    & (
                        stat.S_IXUSR
                        | stat.S_IXGRP
                        | stat.S_IXOTH
                    )
                )
            )

            flags = []

            if world_writable:
                flags.append("RIESGO: ESCRITURA GLOBAL")

            if executable:
                flags.append("EJECUTABLE")

            status = f"[{', '.join(flags)}]" if flags else "[OK]"

            print(f"{permissions:04o} | {relative} | {status}")
            scanned += 1

            if world_writable:
                risky += 1

        except OSError as exc:
            print(f"[ERROR] {item}: {exc}")
            errors += 1

    print("\n=== RESUMEN ===")
    print(f"Elementos inspeccionados: {scanned}")
    print(f"Elementos con escritura global: {risky}")
    print(f"Errores de lectura: {errors}")


if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else "."
    audit_file_permissions(target)
