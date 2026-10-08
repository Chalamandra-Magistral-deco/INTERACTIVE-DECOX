type RateLimitBucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, RateLimitBucket>();
const MAX_BUCKETS = 10_000;

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function pruneExpired(now: number): void {
  if (buckets.size <= MAX_BUCKETS) return;

  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
    if (buckets.size <= MAX_BUCKETS) return;
  }
}

export function enforceSameOrigin(request: Request): Response | null {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) {
    return new Response(JSON.stringify({ error: "Forbidden origin" }), {
      status: 403,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  }

  return null;
}

export function enforceRateLimit(
  request: Request,
  scope: string,
  limit: number,
  windowMs: number,
): Response | null {
  const now = Date.now();
  pruneExpired(now);

  const key = `${scope}:${getClientIp(request)}`;
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }

  if (current.count >= limit) {
    const retryAfter = Math.max(
      1,
      Math.ceil((current.resetAt - now) / 1000),
    );

    return new Response(
      JSON.stringify({
        error: "Rate limit exceeded",
        retry_after_seconds: retryAfter,
      }),
      {
        status: 429,
        headers: {
          "content-type": "application/json; charset=utf-8",
          "cache-control": "no-store",
          "retry-after": String(retryAfter),
        },
      },
    );
  }

  current.count += 1;
  return null;
}

export async function readJsonBody<T>(
  request: Request,
  maxBytes: number,
): Promise<{ data: T } | { error: Response }> {
  const contentLength = Number(request.headers.get("content-length") || "0");
  if (Number.isFinite(contentLength) && contentLength > maxBytes) {
    return {
      error: new Response(
        JSON.stringify({ error: "Request body too large" }),
        {
          status: 413,
          headers: {
            "content-type": "application/json; charset=utf-8",
            "cache-control": "no-store",
          },
        },
      ),
    };
  }

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return {
      error: new Response(JSON.stringify({ error: "Unable to read request body" }), {
        status: 400,
        headers: {
          "content-type": "application/json; charset=utf-8",
          "cache-control": "no-store",
        },
      }),
    };
  }

  if (new TextEncoder().encode(raw).byteLength > maxBytes) {
    return {
      error: new Response(
        JSON.stringify({ error: "Request body too large" }),
        {
          status: 413,
          headers: {
            "content-type": "application/json; charset=utf-8",
            "cache-control": "no-store",
          },
        },
      ),
    };
  }

  try {
    return { data: JSON.parse(raw) as T };
  } catch {
    return {
      error: new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: {
          "content-type": "application/json; charset=utf-8",
          "cache-control": "no-store",
        },
      }),
    };
  }
}
