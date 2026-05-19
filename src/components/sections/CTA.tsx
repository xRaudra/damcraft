"use client";
import { useState } from "react";

const projectTypes = [
  "Brand Identity",
  "UI / UX Design",
  "Product Design",
  "Interior Design",
  "Multiple Services",
  "Not sure yet",
];

type Status = "idle" | "sending" | "success" | "error";

export default function CTA() {
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({ name: "", email: "", phone: "", projectType: "", message: "" });

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "8px",
    padding: "14px 16px",
    fontFamily: "DM Sans, sans-serif",
    fontSize: "15px",
    color: "#FAFAF8",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  return (
    <section id="contact" style={{ background: "linear-gradient(135deg, #1A0E08 0%, #2a1208 100%)", padding: "120px 0", position: "relative", overflow: "hidden" }}>
      {/* Decorative rings */}
      <div style={{ position: "absolute", right: "-120px", top: "50%", transform: "translateY(-50%)", width: "480px", height: "480px", borderRadius: "50%", border: "1px solid rgba(255,83,0,0.08)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", right: "-60px", top: "50%", transform: "translateY(-50%)", width: "320px", height: "320px", borderRadius: "50%", border: "1px solid rgba(255,83,0,0.06)", pointerEvents: "none" }} />

      <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
        <div className="col-2" style={{ alignItems: "flex-start", gap: "80px" }}>

          {/* Left — heading */}
          <div>
            <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", letterSpacing: "0.16em", color: "rgba(255,83,0,0.7)", textTransform: "uppercase", marginBottom: "24px" }}>
              07 — Let&apos;s Build
            </p>
            <h2 style={{ fontFamily: "Raleway, sans-serif", fontWeight: 800, fontSize: "clamp(36px, 4.5vw, 60px)", color: "#FAFAF8", lineHeight: 1.05, marginBottom: "20px" }}>
              Start a<br />
              <span style={{ color: "#FF5300" }}>Project.</span>
            </h2>
            <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "17px", color: "#F3EBE1", opacity: 0.6, lineHeight: 1.8, maxWidth: "340px", marginBottom: "40px" }}>
              No pitch, no fluff — just an honest conversation about what you need and how we build it.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {["Brand Identity", "UI/UX Design", "Product Design", "Interior Design"].map((s) => (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#FF5300", flexShrink: 0 }} />
                  <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "14px", color: "#F3EBE1", opacity: 0.5 }}>{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div style={{ width: "100%" }}>
            {status === "success" ? (
              <div style={{ background: "rgba(255,83,0,0.08)", border: "1px solid rgba(255,83,0,0.2)", borderRadius: "16px", padding: "56px 40px", textAlign: "center" }}>
                <p style={{ fontFamily: "Raleway, sans-serif", fontWeight: 800, fontSize: "28px", color: "#FAFAF8", marginBottom: "12px" }}>Message Received.</p>
                <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "16px", color: "#F3EBE1", opacity: 0.6, lineHeight: 1.7 }}>
                  We&apos;ll get back to you at {form.email} within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* Name + Email */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", letterSpacing: "0.1em", color: "rgba(243,235,225,0.45)", textTransform: "uppercase" }}>Name *</label>
                    <input required value={form.name} onChange={set("name")} placeholder="Saurabh Pandey" style={inputStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(255,83,0,0.5)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", letterSpacing: "0.1em", color: "rgba(243,235,225,0.45)", textTransform: "uppercase" }}>Email *</label>
                    <input required type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" style={inputStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(255,83,0,0.5)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")} />
                  </div>
                </div>

                {/* Phone + Project Type */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", letterSpacing: "0.1em", color: "rgba(243,235,225,0.45)", textTransform: "uppercase" }}>Phone (optional)</label>
                    <input type="tel" value={form.phone} onChange={set("phone")} placeholder="+91 98765 43210" style={inputStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(255,83,0,0.5)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", letterSpacing: "0.1em", color: "rgba(243,235,225,0.45)", textTransform: "uppercase" }}>Project Type</label>
                    <select value={form.projectType} onChange={set("projectType")} style={{ ...inputStyle, cursor: "pointer" }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(255,83,0,0.5)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}>
                      <option value="" style={{ background: "#1A0E08" }}>Select a service</option>
                      {projectTypes.map((t) => <option key={t} value={t} style={{ background: "#1A0E08" }}>{t}</option>)}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", letterSpacing: "0.1em", color: "rgba(243,235,225,0.45)", textTransform: "uppercase" }}>Message *</label>
                  <textarea required rows={5} value={form.message} onChange={set("message")} placeholder="Tell us about your project — what you're building, what you need, and any deadline." style={{ ...inputStyle, resize: "vertical", lineHeight: 1.7 }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(255,83,0,0.5)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")} />
                </div>

                {status === "error" && (
                  <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "14px", color: "#FF5300", margin: 0 }}>
                    Something went wrong. Please try again or email us directly at hello@damcraft.com
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  style={{ fontFamily: "Raleway, sans-serif", fontWeight: 700, fontSize: "15px", letterSpacing: "0.02em", background: "#FF5300", color: "#FAFAF8", padding: "16px 32px", borderRadius: "8px", border: "none", cursor: status === "sending" ? "not-allowed" : "pointer", opacity: status === "sending" ? 0.7 : 1, transition: "background 0.2s, transform 0.15s", alignSelf: "flex-start" }}
                  onMouseEnter={(e) => { if (status !== "sending") { (e.currentTarget as HTMLElement).style.background = "#E04900"; (e.currentTarget as HTMLElement).style.transform = "scale(1.02)"; } }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#FF5300"; (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
                >
                  {status === "sending" ? "Sending…" : "Send Message →"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
