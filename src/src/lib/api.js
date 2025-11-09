const API_BASE = process.env.REACT_APP_API_BASE || "/api";
export function api(path, { method = "GET", body, headers = {}, tenantId } = {}) {
  const opts = { method, headers: { "Content-Type": "application/json", ...(tenantId ? { "X-Tenant-ID": tenantId } : {}), ...headers }, credentials: "include" };
  if (body !== undefined) opts.body = JSON.stringify(body);
  return fetch(`${API_BASE}${path}`, opts).then(async (res) => {
    if (!res.ok) { const t = await res.text().catch(() => ""); throw new Error(t || `HTTP ${res.status}`); }
    const ct = res.headers.get("content-type") || ""; return ct.includes("application/json") ? res.json() : res.text();
  });
}

