"use client";

import React, { useState } from "react";
import { ListVideo, ChevronDown, ChevronUp, RotateCcw, X } from "lucide-react";
import { Panel } from "@/components/panels/Panel";
import { EmberBar } from "./EmberBar";
import { StatusBadge } from "./StatusBadge";
import { tokens } from "@/lib/tokens";
import type { RenderJob } from "@/lib/types";

export interface RenderConsoleProps {
  jobs: RenderJob[];
  height: number;
  onRetry?: (job: RenderJob) => void;
  onCancel?: (job: RenderJob) => void;
}

/**
 * NOTE: `jobs` is provided by the caller — there is no `/jobs` polling
 * endpoint on the backend yet (see lib/types.ts). Once one exists, replace
 * the caller's mock/local state with a real poll (e.g. useEffect + setInterval
 * calling a new `api.jobStatus(id)`); this component doesn't need to change.
 */
export function RenderConsole({ jobs, height, onRetry, onCancel }: RenderConsoleProps) {
  const [open, setOpen] = useState(true);

  return (
    <div style={{ height: open ? height : 34, flexShrink: 0 }}>
      <Panel
        title="Render Console"
        icon={ListVideo}
        right={
          <button
            onClick={() => setOpen((v) => !v)}
            style={{ background: "none", border: "none", color: tokens.color.textDim, cursor: "pointer", display: "flex" }}
            aria-label={open ? "Collapse render console" : "Expand render console"}
          >
            {open ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
        }
        style={{ height: "100%" }}
      >
        {open && (
          <div style={{ padding: "4px 4px" }}>
            {jobs.length === 0 && (
              <div style={{ padding: 16, fontSize: 12.5, color: tokens.color.textFaint, textAlign: "center" }}>
                Nothing queued. Generate a scene to see it here.
              </div>
            )}
            {jobs.map((job) => (
              <div
                key={job.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 100px 140px 70px 60px",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 10px",
                  fontSize: 12,
                  borderBottom: `1px solid ${tokens.color.border}`,
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                  <span style={{ fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{job.scene}</span>
                  <span style={{ fontSize: 10, color: tokens.color.textFaint, fontFamily: tokens.font.mono }}>{job.id}</span>
                </div>
                <StatusBadge status={job.status} />
                <EmberBar value={job.progress} />
                <span style={{ fontSize: 11, color: tokens.color.textDim, textAlign: "right", fontFamily: tokens.font.mono }}>
                  {Math.round(job.progress)}%
                </span>
                <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                  {job.status === "failed" && (
                    <button
                      onClick={() => onRetry?.(job)}
                      style={{ background: "none", border: "none", color: tokens.color.neon, cursor: "pointer" }}
                      aria-label="Retry"
                    >
                      <RotateCcw size={13} />
                    </button>
                  )}
                  <button
                    onClick={() => onCancel?.(job)}
                    style={{ background: "none", border: "none", color: tokens.color.textFaint, cursor: "pointer" }}
                    aria-label="Cancel"
                  >
                    <X size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}
