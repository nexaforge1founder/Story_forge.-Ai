import type { HealthResponse, V5GenerateRequest, GenerateMovieResult } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError((body && (body.detail || body.error)) || res.statusText, res.status);
  }
  return body as T;
}

export const api = {
  health: () => request<HealthResponse>("/health"),

  // Matches server.py's POST /generate/movie/v5 exactly. NOTE: this call
  // blocks until the backend finishes rendering (see lib/types.ts) — there's
  // no job_id to poll yet, so callers should show a long-running loading
  // state and expect this promise to resolve only once rendering completes
  // or the connection times out.
  generateMovieV5: (payload: V5GenerateRequest) =>
    request<GenerateMovieResult>("/generate/movie/v5", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  videoUrl: (videoName: string) => `${API_BASE}/video/${encodeURIComponent(videoName)}`,

  debugVideos: () => request<{ videos: string[] }>("/debug/videos"),

  // NOT YET ON BACKEND — memory.py implements NEW_USER/LOGIN_USER but
  // server.py never exposes them as HTTP routes. These calls will 404 until
  // that gap is closed; kept here so the auth forms have a real target to
  // switch to as soon as it exists, instead of silently no-op-ing.
  login: (username: string, password: string) =>
    request<{ success: boolean; user_id?: string; error?: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),

  register: (username: string, email: string, password: string) =>
    request<{ success: boolean; user_id?: string; error?: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    }),
};

export { ApiError };
