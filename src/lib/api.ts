const API_BASE = "";

export function getApiUrl(path: string) {
  return `${API_BASE}${path}`;
}

export function getHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("gcpl_token") : null;
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(getApiUrl(path), { headers: getHeaders() });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function apiPost<T>(path: string, data: unknown): Promise<T> {
  const res = await fetch(getApiUrl(path), {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || `API error: ${res.status}`);
  }
  return res.json();
}

export async function apiPut<T>(path: string, data: unknown): Promise<T> {
  const res = await fetch(getApiUrl(path), {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || `API error: ${res.status}`);
  }
  return res.json();
}

export async function apiDelete<T>(path: string, id: string): Promise<T> {
  const res = await fetch(getApiUrl(`${path}?id=${id}`), {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || `API error: ${res.status}`);
  }
  return res.json();
}
