const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json", ...options?.headers },
      ...options,
    });
  } catch {
    throw new Error("The backend is unavailable. Please try again.");
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null) as { detail?: string | { msg?: string }[] } | null;
    const detail = Array.isArray(body?.detail) ? body.detail[0]?.msg : body?.detail;
    throw new Error(detail || "The request could not be completed.");
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export async function checkBackendHealth() {
  return apiRequest<{ status: string }>("/health");
}