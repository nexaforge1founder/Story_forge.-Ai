"use client";

import { useState } from "react";
import { Eye, Boxes, Layers, Play, Pause, Square, SkipBack, SkipForward, Sparkles, Loader2 } from "lucide-react";
import { Panel } from "@/components/panels/Panel";
import { useResizablePanel } from "@/components/panels/useResizablePanel";
import { StyleManager } from "@/components/style/StyleManager";
import { RenderConsole } from "@/components/render/RenderConsole";
import { tokens } from "@/lib/tokens";
import { api, ApiError } from "@/lib/api";
import type { RenderJob, StyleKey } from "@/lib/types";

const SCENE_TREE = [
  { label: "Act I", indent: false },
  { label: "Scene 1 — Forest Entrance", indent: true },
  { label: "Scene 2 — Campfire", indent: true },
  { label: "Act II", indent: false },
  { label: "Scene 3 — City Rooftop", indent: true },
  { label: "Scene 4 — Forest Chase", indent: true },
];

const INSPECTOR_ROWS: [string, string][] = [
  ["Shot type", "Tracking"],
  ["Lens bias", "Normal"],
  ["Movement energy", "0.55"],
  ["Depth of field", "On"],
  ["DOF strength", "0.50"],
];

export default function MovieWorkspacePage() {
  const [style, setStyle] = useState<StyleKey>("aurora_stylized");
  const [selectedScene, setSelectedScene] = useState("Scene 4 — Forest Chase");
  const [jobs, setJobs] = useState<RenderJob[]>([]);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  const [treeWidth, onTreeDrag] = useResizablePanel(220, { min: 160, max: 400, axis: "x" });
  const [inspectorWidth, onInspectorDrag] = useResizablePanel(280, { min: 220, max: 460, axis: "x", invert: true });
  const [consoleHeight, onConsoleDrag] = useResizablePanel(190, { min: 90, max: 380, axis: "y", invert: true });

  // Real call to the actual backend. This BLOCKS until the render finishes
  // or the connection times out — server.py has no job queue yet (see
  // lib/types.ts). The loading state below is honest about that: it stays
  // spinning for as long as the request takes, which for a real render
  // could be minutes, and Render's free-tier proxy will kill it well before
  // a full scene finishes rendering.
  async function handleGenerate() {
    setGenerating(true);
    setGenerateError(null);
    const jobId = `local_${Date.now()}`;
    setJobs((prev) => [{ id: jobId, scene: selectedScene, status: "rendering", progress: 5 }, ...prev]);

    try {
      const result = await api.generateMovieV5({
        script: {
          title: "Untitled Production",
          style,
          scenes: [
            {
              scene_id: selectedScene.split(" — ")[0]?.replace(/\s+/g, "_").toLowerCase() || "scene_1",
              duration_seconds: 3,
              environment: "forest",
              lighting: "sunset",
              characters: [{ character_id: "hero", action: "walking", emotion: "determined", intensity: 0.6 }],
            },
          ],
        },
        generation_mode: "3d",
        fps: 24,
      });

      setJobs((prev) => prev.map((j) => (j.id === jobId
        ? { ...j, status: result.success === false ? "failed" : "completed", progress: 100 }
        : j)));
    } catch (err) {
      const message = err instanceof ApiError ? `${err.status}: ${err.message}` : err instanceof Error ? err.message : "Generation failed.";
      setGenerateError(message);
      setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, status: "failed" } : j)));
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", minHeight: 0 }}>
      <div style={{ flex: 1, display: "flex", padding: 10, gap: 4, minHeight: 0 }}>
        <div style={{ width: treeWidth, flexShrink: 0 }}>
          <Panel title="Scene Tree" icon={Layers}>
            <div style={{ padding: 8, fontSize: 12.5 }}>
              {SCENE_TREE.map((row) => (
                <div
                  key={row.label}
                  onClick={() => row.indent && setSelectedScene(row.label)}
                  style={{
                    padding: "5px 8px",
                    borderRadius: 5,
                    color: row.indent ? tokens.color.textDim : tokens.color.text,
                    fontWeight: row.indent ? 400 : 600,
                    marginLeft: row.indent ? 10 : 0,
                    background: row.label === selectedScene ? tokens.color.purpleDim : "transparent",
                    cursor: row.indent ? "pointer" : "default",
                  }}
                >
                  {row.label}
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div onMouseDown={onTreeDrag} style={{ width: 4, cursor: "col-resize", flexShrink: 0 }} />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
          <Panel
            title={`Preview — ${selectedScene}`}
            icon={Eye}
            right={
              <div style={{ display: "flex", gap: 4 }}>
                {[SkipBack, Play, Pause, Square, SkipForward].map((Ico, i) => (
                  <button
                    key={i}
                    style={{ width: 22, height: 22, borderRadius: 5, border: `1px solid ${tokens.color.border}`, background: tokens.color.panel, color: tokens.color.textDim, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                  >
                    <Ico size={11} />
                  </button>
                ))}
              </div>
            }
            style={{ flex: 1 }}
          >
            <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(circle at 50% 40%, #1c1c26 0%, #0b0b0f 75%)", color: tokens.color.textFaint, flexDirection: "column", gap: 10 }}>
              <Sparkles size={26} color={tokens.color.textFaint} />
              <span style={{ fontSize: 12 }}>Blender viewport preview renders here</span>
              <span style={{ fontSize: 10.5, color: tokens.color.textFaint, fontFamily: tokens.font.mono }}>1920×1080 · 24fps · {style}</span>

              <button
                onClick={handleGenerate}
                disabled={generating}
                style={{
                  marginTop: 10, display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 999, border: "none", cursor: generating ? "default" : "pointer",
                  background: generating ? tokens.color.borderLight : `linear-gradient(90deg, ${tokens.color.emberGoldStart}, ${tokens.color.emberEnd})`,
                  color: "#0b0b0f", fontWeight: 700, fontSize: 13,
                }}
              >
                {generating ? <><Loader2 size={14} className="ff-spin" /> Rendering…</> : "Generate scene"}
              </button>
              {generateError && (
                <span style={{ fontSize: 11.5, color: tokens.color.crimson, maxWidth: 320, textAlign: "center" }}>{generateError}</span>
              )}
            </div>
          </Panel>

          <StyleManager value={style} onChange={setStyle} />
        </div>

        <div onMouseDown={onInspectorDrag} style={{ width: 4, cursor: "col-resize", flexShrink: 0 }} />

        <div style={{ width: inspectorWidth, flexShrink: 0 }}>
          <Panel title="Inspector — Camera" icon={Boxes}>
            <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 12, fontSize: 12 }}>
              {INSPECTOR_ROWS.map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: tokens.color.textDim }}>{k}</span>
                  <span style={{ color: tokens.color.text, fontSize: 11.5, fontFamily: tokens.font.mono }}>{v}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      <div onMouseDown={onConsoleDrag} style={{ height: 4, cursor: "row-resize", flexShrink: 0 }} />
      <div style={{ padding: "0 10px 10px" }}>
        <RenderConsole jobs={jobs} height={consoleHeight} />
      </div>
    </div>
  );
}
