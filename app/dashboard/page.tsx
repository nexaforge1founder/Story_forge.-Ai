"use client";

import { useEffect, useState } from "react";
import { Cpu, Film, HardDrive, Activity } from "lucide-react";
import { tokens } from "@/lib/tokens";
import { api } from "@/lib/api";
import type { HealthResponse } from "@/lib/types";

// NOT YET ON BACKEND: no /projects or /stats endpoint exists — these are
// placeholder rows so the layout is real even before that data exists.
const RECENT_PROJECTS = [
  { title: "Forest Chase — Feature Cut", updated: "2 hours ago" },
  { title: "City Rooftop Trailer", updated: "yesterday" },
];

function StatCard({ icon: Icon, label, value, accent }: { icon: any; label: string; value: string; accent?: string }) {
  return (
    <div style={{ flex: 1, minWidth: 160, padding: 16, borderRadius: 12, background: tokens.color.panel, border: `1px solid ${tokens.color.border}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <Icon size={15} color={accent ?? tokens.color.textDim} />
        <span style={{ fontSize: 11.5, color: tokens.color.textDim, textTransform: "uppercase", letterSpacing: 0.4 }}>{label}</span>
      </div>
      <div style={{ fontFamily: tokens.font.mono, fontSize: 22, fontWeight: 600, color: tokens.color.text }}>{value}</div>
    </div>
  );
}

export default function DashboardHomePage() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [healthError, setHealthError] = useState<string | null>(null);

  useEffect(() => {
    api.health().then(setHealth).catch((e) => setHealthError(e instanceof Error ? e.message : "Could not reach backend."));
  }, []);

  return (
    <div style={{ padding: 20, overflow: "auto", height: "100%" }}>
      <h1 style={{ fontFamily: tokens.font.display, fontSize: 22, fontWeight: 600, margin: "0 0 4px" }}>Home</h1>
      <p style={{ fontSize: 13, color: tokens.color.textDim, margin: "0 0 20px" }}>
        {healthError ? `Backend unreachable: ${healthError}` : health
          ? `Backend online · Blender ${health.blender?.installed ? "installed" : "missing"} · V5 pipeline ${health.movie_pipeline_v5_available ? "available" : "unavailable"}`
          : "Checking backend status…"}
      </p>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
        <StatCard icon={Cpu} label="CPU (last render)" value="—" accent={tokens.color.emberEnd} />
        <StatCard icon={Activity} label="Render Queue" value="2 active" />
        <StatCard icon={HardDrive} label="Storage Used" value="—" />
        <StatCard icon={Film} label="Movies Created" value={String(RECENT_PROJECTS.length)} />
      </div>

      <h2 style={{ fontFamily: tokens.font.display, fontSize: 15, fontWeight: 600, margin: "0 0 10px" }}>Recent Projects</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {RECENT_PROJECTS.map((p) => (
          <div
            key={p.title}
            style={{ display: "flex", justifyContent: "space-between", padding: "12px 14px", borderRadius: 10, background: tokens.color.panel, border: `1px solid ${tokens.color.border}` }}
          >
            <span style={{ fontSize: 13, fontWeight: 500 }}>{p.title}</span>
            <span style={{ fontSize: 12, color: tokens.color.textFaint }}>{p.updated}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
