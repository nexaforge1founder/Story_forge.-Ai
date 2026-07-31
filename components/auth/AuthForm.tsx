"use client";

import React, { useState } from "react";
import { Mail, Lock, User, ArrowRight, Loader2, Flame } from "lucide-react";
import { tokens } from "@/lib/tokens";
import { api, ApiError } from "@/lib/api";

export type AuthMode = "login" | "register" | "forgot-password";

const COPY: Record<AuthMode, { title: string; subtitle: string; cta: string }> = {
  login: { title: "Welcome back", subtitle: "Sign in to keep working on your production.", cta: "Sign in" },
  register: { title: "Create your account", subtitle: "Start forging your first story.", cta: "Create account" },
  "forgot-password": { title: "Reset your password", subtitle: "We'll send you a reset link.", cta: "Send reset link" },
};

/**
 * Fully functional form (validation, loading, error states) wired to
 * lib/api.ts. NOTE: /auth/login and /auth/register aren't exposed by
 * server.py yet (memory.py has the logic, it's just not routed) — submitting
 * this form today will surface that as a clear error rather than fail
 * silently, so it's obvious what to fix once those routes are added.
 */
export function AuthForm({ mode, onSuccess }: { mode: AuthMode; onSuccess?: () => void }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const copy = COPY[mode];

  async function handleSubmit(e: any) {
    e.preventDefault();
    setError(null);

    if (mode !== "forgot-password" && (!username || !password)) {
      setError("Username and password are required.");
      return;
    }
    if (mode === "register" && !email) {
      setError("Email is required.");
      return;
    }
    if (mode === "register" && password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "login") {
        const result = await api.login(username, password);
        if (!result.success) throw new Error(result.error || "Login failed.");
      } else if (mode === "register") {
        const result = await api.register(username, email, password);
        if (!result.success) throw new Error(result.error || "Registration failed.");
      }
      onSuccess?.();
    } catch (err) {
      const message = err instanceof ApiError && err.status === 404
        ? "Auth isn't wired up on the backend yet (server.py has no /auth routes)."
        : err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        width: 360,
        padding: 28,
        borderRadius: 14,
        background: "rgba(20,20,25,0.75)",
        backdropFilter: "blur(16px)",
        border: `1px solid ${tokens.color.border}`,
        boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
        <div
          style={{
            width: 26, height: 26, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center",
            background: `linear-gradient(135deg, ${tokens.color.emberGoldStart}, ${tokens.color.emberEnd})`,
          }}
        >
          <Flame size={15} color="#0b0b0f" strokeWidth={2.5} />
        </div>
        <span style={{ fontFamily: tokens.font.display, fontSize: 15, fontWeight: 700, color: tokens.color.text }}>
          STORY FORGE<span style={{ color: tokens.color.purple }}>.AI</span>
        </span>
      </div>

      <h1 style={{ fontFamily: tokens.font.display, fontSize: 20, fontWeight: 600, color: tokens.color.text, margin: "0 0 4px" }}>
        {copy.title}
      </h1>
      <p style={{ fontSize: 12.5, color: tokens.color.textDim, margin: "0 0 20px" }}>{copy.subtitle}</p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {mode !== "forgot-password" && (
          <Field icon={User} placeholder="Username" value={username} onChange={setUsername} />
        )}
        {(mode === "register" || mode === "forgot-password") && (
          <Field icon={Mail} placeholder="Email" type="email" value={email} onChange={setEmail} />
        )}
        {mode !== "forgot-password" && (
          <Field icon={Lock} placeholder="Password" type="password" value={password} onChange={setPassword} />
        )}

        {error && (
          <div style={{ fontSize: 12, color: tokens.color.crimson, background: `${tokens.color.crimson}14`, border: `1px solid ${tokens.color.crimson}33`, borderRadius: 8, padding: "8px 10px" }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            marginTop: 6, padding: "10px 14px", borderRadius: 9, border: "none",
            background: loading ? tokens.color.borderLight : tokens.color.purple,
            color: "#fff", fontWeight: 600, fontSize: 13, cursor: loading ? "default" : "pointer",
          }}
        >
          {loading ? <Loader2 size={15} className="ff-spin" /> : <>{copy.cta} <ArrowRight size={15} /></>}
        </button>
      </form>
    </div>
  );
}

function Field({ icon: Icon, placeholder, value, onChange, type = "text" }: {
  icon: any; placeholder: string; value: string; onChange: (v: string) => void; type?: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", borderRadius: 9, border: `1px solid ${tokens.color.border}`, background: tokens.color.panel }}>
      <Icon size={14} color={tokens.color.textFaint} />
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e: any) => onChange(e.target.value)}
        style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: tokens.color.text, fontSize: 13 }}
      />
    </div>
  );
}
