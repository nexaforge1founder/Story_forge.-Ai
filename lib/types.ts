/**
 * Shapes mirrored from the actual backend (server.py, style/style_manager.py,
 * production/movie_pipeline.py) — not invented. Where the backend doesn't
 * expose something yet (job status polling, a style-list endpoint, auth
 * routes), it's marked NOT YET ON BACKEND below rather than pretended.
 */

export interface HealthResponse {
  status?: string;
  blender?: { installed: boolean; binary: string; version?: string | null };
  ffmpeg?: { installed: boolean; binary: string; version?: string | null };
  supported_generation_modes: string[];
  default_generation_mode: string;
  movie_pipeline_v5_available: boolean;
}

// The 5 styles actually registered in style/style_manager.py after the
// DC/Pixar/Disney removal. NOT YET ON BACKEND: there's no GET endpoint that
// returns this list — it's a static mirror until StyleManager.list_styles()
// is exposed over HTTP. Keep this array in sync with style/__init__.py's
// AVAILABLE_STYLES by hand until then.
export const AVAILABLE_STYLES = [
  { key: "anime", label: "Japanese Anime" },
  { key: "hybrid_anime_cinematic", label: "Hybrid Anime + Cinematic" },
  { key: "aurora_stylized", label: "Aurora Stylized" },
  { key: "semi_realistic", label: "Semi Realistic" },
  { key: "custom", label: "Custom" },
] as const;

export type StyleKey = (typeof AVAILABLE_STYLES)[number]["key"];

export interface CharacterInput {
  character_id: string;
  action?: string;
  emotion?: string;
  intensity?: number;
  dialogue?: string;
  reference_asset_ids?: string[];
}

export interface SceneInput {
  scene_id?: string;
  duration_seconds?: number;
  environment?: string;
  lighting?: string;
  characters?: CharacterInput[];
}

export interface ProductionScript {
  title: string;
  style: StyleKey | string;
  scenes: SceneInput[];
}

// Matches server.py's V5ProductionRequest body.
export interface V5GenerateRequest {
  script: ProductionScript;
  generation_mode?: "2d" | "3d";
  fps?: number;
}

// Matches what generate_movie_internal() returns today. This call is
// SYNCHRONOUS on the backend right now (see server.py docs/README) — there
// is no job_id / polling endpoint yet, so a real render will hold this HTTP
// request open for as long as rendering takes. The frontend below shows a
// loading state and handles the eventual response, but this is the exact
// "stuck loading" problem flagged earlier — it isn't fixed until the
// backend gets an async job queue.
export interface GenerateMovieResult {
  success?: boolean;
  job_id?: string;
  video_path?: string;
  video_url?: string;
  error?: string;
  production_package?: unknown;
  [key: string]: unknown;
}

// NOT YET ON BACKEND: no /jobs/{id} status endpoint exists. Shape kept here
// so RenderConsole can switch from polling mock data to a real poll with a
// one-line change once that endpoint exists.
export interface RenderJob {
  id: string;
  scene: string;
  status: "queued" | "rendering" | "completed" | "failed" | "paused";
  progress: number;
  eta?: string;
}
