import { useState, useRef, useEffect, useCallback } from "react";

/* ─────────────────────────────────────────────
   GOOGLE FONT — Montserrat
───────────────────────────────────────────── */
const FontLoader = () => {
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
    s.async = true;
    document.head.appendChild(s);
  }, []);
  return null;
};

/* ─────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────── */
const T = {
  font: "'Montserrat', sans-serif",
  bg: "#0a0d12",
  card: "#0f1318",
  surface: "#151a22",
  border: "#1e2530",
  borderLight: "#252d3a",
  white: "#ffffff",
  muted: "#6b7a90",
  mutedLight: "#8a99b0",
  blue: "#2563eb",
  blueBright: "#3b82f6",
  gold: "#f59e0b",
  green: "#10b981",
  red: "#ef4444",
  violet: "#8b5cf6",
  violetDim: "rgba(139,92,246,0.15)",
  cyan: "#06b6d4",
  cyanDim: "rgba(6,182,212,0.15)",
};

const SW = 440;
const SH = 440;

/* Radar Reel — separate vertical export canvas (1080x1920), independent of
   the 440x440 carousel canvas above. Does not affect carousel categories. */
const REEL_W = 1080;
const REEL_H = 1920;
const REEL_PREVIEW_SCALE = 0.32; // on-screen preview size = REEL_W/H * this
const RW = Math.round(REEL_W * REEL_PREVIEW_SCALE);
const RH = Math.round(REEL_H * REEL_PREVIEW_SCALE);

const slideBase = {
  width: SW, height: SH,
  fontFamily: T.font,
  background: T.card,
  borderRadius: 18,
  position: "relative",
  overflow: "hidden",
  boxSizing: "border-box",
  flexShrink: 0,
  color: T.white,
  border: `1px solid ${T.border}`,
  textAlign: "left"
};

/* Base style for Radar Reel scenes — rendered at full 1080x1920 and scaled
   down for on-screen preview via transform, so html2canvas always captures
   the true 1080x1920 layout. */
const reelSlideBase = {
  width: REEL_W, height: REEL_H,
  fontFamily: T.font,
  background: "#09090f",
  position: "relative",
  overflow: "hidden",
  boxSizing: "border-box",
  flexShrink: 0,
  color: T.white,
  textAlign: "left",
};

/* ─────────────────────────────────────────────
   SHARED MICRO-COMPONENTS
───────────────────────────────────────────── */
function GridOverlay() {
  return (
    <div style={{
      position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
      backgroundImage: `linear-gradient(${T.border}55 1px, transparent 1px), linear-gradient(90deg, ${T.border}55 1px, transparent 1px)`,
      backgroundSize: "40px 40px", opacity: 0.35,
    }} />
  );
}

function CornerMark({ color = T.blueBright }) {
  return (
    <>
      <div style={{ position: "absolute", top: 0, right: 0, width: 60, height: 60, zIndex: 1, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: 0, right: 0, width: 60, height: 1, background: `linear-gradient(to left, ${color}, transparent)` }} />
        <div style={{ position: "absolute", top: 0, right: 0, width: 1, height: 60, background: `linear-gradient(to bottom, ${color}, transparent)` }} />
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, width: 60, height: 60, zIndex: 1, pointerEvents: "none" }}>
        <div style={{ position: "absolute", bottom: 0, left: 0, width: 60, height: 1, background: `linear-gradient(to right, ${color}, transparent)` }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, width: 1, height: 60, background: `linear-gradient(to top, ${color}, transparent)` }} />
      </div>
    </>
  );
}

function SlideNum({ n, color = T.muted }) {
  return (
    <div style={{ position: "absolute", top: 18, right: 20, fontSize: 11, fontWeight: 700, color, letterSpacing: 2, zIndex: 10 }}>
      {String(n).padStart(2, "0")}
    </div>
  );
}

function EduBadge() {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: T.blue, borderRadius: 20, padding: "4px 11px", fontSize: 9, fontWeight: 800, letterSpacing: 1.8, color: T.white }}>
      🎓 EDUCATION
    </div>
  );
}

function RadarBadge() {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.35)", borderRadius: 20, padding: "4px 11px", fontSize: 9, fontWeight: 800, letterSpacing: 1.8, color: T.gold }}>
      📡 RADAR
    </div>
  );
}

function ReviewBadge() {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 20, padding: "4px 11px", fontSize: 9, fontWeight: 800, letterSpacing: 1.8, color: T.green }}>
      📋 REVIEW
    </div>
  );
}

function BreakdownBadge() {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.35)", borderRadius: 20, padding: "4px 11px", fontSize: 9, fontWeight: 800, letterSpacing: 1.8, color: T.violet }}>
      🔍 BREAKDOWN
    </div>
  );
}

function ConceptBadge() {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.35)", borderRadius: 20, padding: "4px 11px", fontSize: 9, fontWeight: 800, letterSpacing: 1.8, color: T.cyan, width: "fit-content" }}>
      💡 CONCEPT
    </div>
  );
}

function MarketViewsBadge() {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.35)", borderRadius: 20, padding: "4px 11px", fontSize: 9, fontWeight: 800, letterSpacing: 1.8, color: "#ef4444", width: "fit-content" }}>
      🔥 MARKET VIEWS
    </div>
  );
}

function RadarReelBadge({ scale = 1 }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 5 * scale, background: "rgba(245,158,11,0.12)", border: `${1 * scale}px solid rgba(245,158,11,0.35)`, borderRadius: 20 * scale, padding: `${4 * scale}px ${11 * scale}px`, fontSize: 9 * scale, fontWeight: 800, letterSpacing: 1.8 * scale, color: T.gold, width: "fit-content" }}>
      📡 RADAR
    </div>
  );
}

/* Instagram + Telegram icons */
function IgIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={T.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4.5"/>
      <circle cx="17.5" cy="6.5" r="1" fill={T.muted} stroke="none"/>
    </svg>
  );
}

function TgIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={T.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/>
      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  );
}

function Brand({ name = "CANDLEWISE", color = T.muted }) {
  return (
    <div style={{ position: "absolute", bottom: 10, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px", zIndex: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 7.5, fontWeight: 800, letterSpacing: 2.2, color, textTransform: "uppercase" }}>
        <span style={{ fontSize: 10, opacity: 0.75 }}>▲</span> {name}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
          <IgIcon /><span style={{ fontSize: 7, fontWeight: 600, color: T.muted, letterSpacing: 0.2 }}>@candlewise.hq</span>
        </div>
        <span style={{ fontSize: 6, color: T.border }}>·</span>
        <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
          <TgIcon /><span style={{ fontSize: 7, fontWeight: 600, color: T.muted, letterSpacing: 0.2 }}>/candlewise</span>
        </div>
      </div>
    </div>
  );
}

function SaveForLater({ color = T.muted }) {
  return (
    <div style={{ position: "absolute", bottom: 26, right: 18, display: "flex", alignItems: "center", gap: 4, fontSize: 8.5, fontWeight: 600, color, zIndex: 10, cursor: "pointer" }}>
      Save for later
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────
   DISCLAIMER SLIDE
───────────────────────────────────────────── */
function DisclaimerSlide({ brand, accent = T.blueBright }) {
  return (
    <div style={{ ...slideBase, background: T.bg, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "24px 28px", textAlign: "center" }}>
      <GridOverlay />
      <CornerMark color={accent} />
      <div style={{ position: "relative", zIndex: 2, width: "100%" }}>
        <div style={{ fontSize: 30, marginBottom: 12 }}>⚖️</div>
        <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: 1.5, color: accent, marginBottom: 10, textTransform: "uppercase" }}>Important Disclaimer</div>
        <div style={{ height: 1, background: `${accent}33`, margin: "0 0 14px" }} />
        <div style={{ fontSize: 10.5, color: T.mutedLight, lineHeight: 1.9, fontWeight: 500 }}>
          We are <strong style={{ color: T.white }}>NOT SEBI Registered Investment Advisors.</strong>
          <br /><br />
          All content is for <strong style={{ color: T.white }}>educational purposes only</strong> and does not constitute financial advice, a buy/sell recommendation, or solicitation of any kind.
          <br /><br />
          Markets involve risk. Always do your own research or consult a qualified financial advisor before making any investment decisions.
          <br /><br />
          <span style={{ color: accent, fontWeight: 700 }}>Trade responsibly. Protect your capital.</span>
        </div>
        <div style={{ height: 1, background: `${accent}33`, margin: "14px 0 0" }} />
      </div>
      <Brand name={brand} color={T.muted} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   EDUCATION SLIDES
═══════════════════════════════════════════════════════════ */
function EduSlide1({ d }) {
  return (
    <div style={{ ...slideBase, padding: "22px 24px 36px" }}>
      <GridOverlay />
      <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)", zIndex: 0 }} />
      <CornerMark color={T.blueBright} />
      <SlideNum n={1} />
      <div style={{ position: "relative", zIndex: 2, textAlign: "left" }}>
        <EduBadge />
        <div style={{ marginTop: 24, lineHeight: 1 }}>
          <div style={{ fontSize: 44, fontWeight: 900, letterSpacing: -1.5, color: T.white }}>{d.titleLine1}</div>
          <div style={{ fontSize: 44, fontWeight: 900, letterSpacing: -1.5, color: T.white }}>{d.titleLine2}</div>
          <div style={{ fontSize: 44, fontWeight: 900, letterSpacing: -1.5, color: T.blueBright }}>{d.titleHighlight}</div>
        </div>
        <div style={{ marginTop: 16, color: T.muted, fontSize: 12, lineHeight: 1.75, fontWeight: 500, maxWidth: 240 }}>{d.subtitle}</div>
        <div style={{ marginTop: 22, display: "flex", alignItems: "center", gap: 7, fontSize: 11, fontWeight: 700, color: T.blueBright }}>
          <div style={{ width: 22, height: 22, borderRadius: "50%", border: `1.5px solid ${T.blueBright}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>→</div>
          Swipe to learn
        </div>
      </div>
      <Brand name={d.brand} />
      <SaveForLater />
    </div>
  );
}

function EduSlide2({ d, chartImg }) {
  return (
    <div style={{ ...slideBase, padding: "16px 18px 36px" }}>
      <CornerMark color={T.blueBright} />
      <SlideNum n={2} />
      <div style={{ position: "relative", zIndex: 2 }}>
        <EduBadge />
        <div style={{ marginTop: 8, fontSize: 14, fontWeight: 900, letterSpacing: -0.3 }}>
          THE CHART <span style={{ color: T.blueBright }}>EXPLAINED</span>
        </div>
        <div style={{ marginTop: 8, borderRadius: 10, overflow: "hidden", height: 220, width: "100%", background: T.surface, border: `1px solid ${T.border}`, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {chartImg
            ? <img src={chartImg} alt="chart" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            : <div style={{ textAlign: "center", color: T.muted, fontSize: 12 }}><div style={{ fontSize: 28, marginBottom: 6 }}>📈</div>Upload your chart screenshot</div>
          }
          {chartImg && d.chartTopLabel && (
            <div style={{ position: "absolute", top: 7, left: 7, background: "rgba(37,99,235,0.92)", borderRadius: 6, padding: "3px 8px", fontSize: 8.5, fontWeight: 700, color: T.white, lineHeight: 1.5 }}>{d.chartTopLabel}</div>
          )}
          {chartImg && d.chartBottomLabel && (
            <div style={{ position: "absolute", bottom: 7, right: 7, background: "rgba(10,13,18,0.9)", border: `1px solid ${T.border}`, borderRadius: 6, padding: "3px 8px", fontSize: 8.5, fontWeight: 700, color: T.white, lineHeight: 1.5, textAlign: "center" }}>{d.chartBottomLabel}</div>
          )}
        </div>
        {d.chartCaption && (
          <div style={{ marginTop: 10, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "8px 12px" }}>
            <div style={{ fontSize: 10, color: T.mutedLight, lineHeight: 1.6, fontWeight: 500 }}>{d.chartCaption}</div>
          </div>
        )}
      </div>
      <Brand name={d.brand} />
    </div>
  );
}

function EduSlide3({ d }) {
  return (
    <div style={{ ...slideBase, padding: "20px 22px 36px" }}>
      <GridOverlay />
      <div style={{ position: "absolute", bottom: -30, right: -30, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)", zIndex: 0 }} />
      <CornerMark color={T.blueBright} />
      <SlideNum n={3} />
      <div style={{ position: "relative", zIndex: 2 }}>
        <EduBadge />
        <div style={{ marginTop: 10, fontSize: 15, fontWeight: 900, letterSpacing: -0.3 }}>WHY THIS <span style={{ color: T.blueBright }}>MATTERS</span></div>
        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 13 }}>
          {d.whyPoints.map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{ width: 40, height: 40, flexShrink: 0, borderRadius: 11, background: p.bg, border: `1px solid ${p.borderColor}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{p.icon}</div>
              <div style={{ paddingTop: 1, textAlign: "left" }}>
                <div style={{ fontSize: 11.5, fontWeight: 800, marginBottom: 3 }}>{p.title}</div>
                <div style={{ fontSize: 10.5, color: T.muted, lineHeight: 1.6, fontWeight: 500 }}>{p.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Brand name={d.brand} />
      <SaveForLater />
    </div>
  );
}

function EduSlide4({ d }) {
  return (
    <div style={{ ...slideBase, padding: "20px 20px 36px" }}>
      <GridOverlay />
      <CornerMark color={T.blueBright} />
      <SlideNum n={4} />
      <div style={{ position: "relative", zIndex: 2 }}>
        <EduBadge />
        <div style={{ marginTop: 10, fontSize: 15, fontWeight: 900, letterSpacing: -0.3 }}>THE <span style={{ color: T.blueBright }}>PATTERN</span></div>
        <div style={{ marginTop: 18, display: "flex", alignItems: "flex-start", gap: 0 }}>
          {d.patternSteps.map((step, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", flex: 1 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: T.surface, border: `1.5px solid ${i === 2 ? T.blueBright : T.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, marginBottom: 6, boxShadow: i === 2 ? `0 0 14px rgba(59,130,246,0.3)` : "none" }}>{step.icon}</div>
                <div style={{ fontSize: 8.5, fontWeight: 700, color: T.blueBright, marginBottom: 2 }}>{i + 1}</div>
                <div style={{ fontSize: 8, fontWeight: 600, color: T.mutedLight, textAlign: "center", lineHeight: 1.45, whiteSpace: "pre-wrap", paddingLeft: 2, paddingRight: 2 }}>{step.label}</div>
              </div>
              {i < d.patternSteps.length - 1 && (
                <div style={{ paddingTop: 16, color: T.muted, fontSize: 11, flexShrink: 0 }}>→</div>
              )}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 22, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18 }}>⭐</span>
          <div style={{ fontSize: 11, fontWeight: 700, lineHeight: 1.5, color: T.white }}>{d.tagline}</div>
        </div>
      </div>
      <Brand name={d.brand} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   RADAR SLIDES
═══════════════════════════════════════════════════════════ */
/* ── Helpers for the RADAR hook slide ── */

// Masked letter tiles — shows ticker LENGTH without revealing the name
function MaskedTicker({ ticker = "????", exchange }) {
  const letters = (ticker || "").replace(/[^A-Za-z]/g, "").split("");
  const show = letters.length ? letters : ["?", "?", "?", "?", "?"];
  return (
    <div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {show.slice(0, 7).map((_, i) => (
          <div key={i} style={{
            width: 30, height: 40, borderRadius: 8,
            background: T.surface, border: `1px solid ${T.borderLight}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 900, color: T.gold,
          }}>?</div>
        ))}
      </div>
      <div style={{ marginTop: 7, fontSize: 9, fontWeight: 800, color: T.muted, letterSpacing: 2 }}>
        {show.length}-LETTER TICKER{exchange ? ` · ${exchange}` : ""}
      </div>
    </div>
  );
}

// Deterministic "mystery price action" bars — seeded from text so every post
// automatically gets a slightly different silhouette, with no manual work.
function MysteryBars({ seed = "candlewise" }) {
  let h = 7;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 2147483647;
  const bars = Array.from({ length: 16 }, () => {
    h = (h * 9301 + 49297) % 233280;
    return 10 + (h % 32);
  });
  const peakIdx = bars.indexOf(Math.max(...bars));
  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 42 }}>
        {bars.map((v, i) => (
          <div key={i} style={{
            width: 7, height: v, borderRadius: 2,
            background: i === peakIdx ? T.gold : T.borderLight,
            boxShadow: i === peakIdx ? `0 0 10px ${T.gold}` : "none",
          }} />
        ))}
      </div>
      <div style={{ marginTop: 7, fontSize: 9, fontWeight: 800, color: T.muted, letterSpacing: 2 }}>
        PATTERN SPOTTED ON THE RADAR
      </div>
    </div>
  );
}

// Big teaser stat — a number that hints at the story without naming the stock
function HookStat({ value = "—", label = "" }) {
  return (
    <div>
      <div style={{ fontSize: 42, fontWeight: 900, letterSpacing: -1.5, lineHeight: 0.95, color: T.gold }}>{value}</div>
      <div style={{ marginTop: 5, fontSize: 9, fontWeight: 800, color: T.muted, letterSpacing: 2, textTransform: "uppercase" }}>{label}</div>
    </div>
  );
}

function RadarSlide1({ d }) {
  const variant = d.hookVariant || "redacted";

  return (
    <div style={{ ...slideBase, padding: "20px 24px 50px", background: "#09090f" }}>
      <GridOverlay />
      <div style={{ position: "absolute", bottom: -60, left: -60, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.13) 0%, transparent 60%)", zIndex: 0 }} />
      <div style={{ position: "absolute", top: -30, right: -30, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 65%)", zIndex: 0 }} />
      <CornerMark color={T.gold} />
      <SlideNum n={1} color={T.muted} />

      <div style={{ position: "relative", zIndex: 2, textAlign: "left" }}>
        <RadarBadge />

        {/* Hero heading */}
        <div style={{ marginTop: 16, fontSize: 26, fontWeight: 900, lineHeight: 1.15, letterSpacing: -0.5 }}>
        STOCK I'M WATCHING <span style={{ color: T.gold }}>CLOSELY</span>
        </div>

        {/* Hero — varies by hookVariant so every post doesn't look identical */}
        <div style={{ marginTop: 16 }}>
          {variant === "stat" && <HookStat value={d.hookStat?.value} label={d.hookStat?.label} />}
          {variant === "chart" && <MysteryBars seed={`${d.hookHeadline || ""}${d.weekLabel || ""}`} />}
          {(variant === "redacted" || !variant) && <MaskedTicker ticker={d.ticker} exchange={d.exchange} />}
        </div>

        {/* Subtle hint — small, not the hero anymore */}
        <div style={{ marginTop: 14, fontSize: 11, fontWeight: 600, color: T.mutedLight, lineHeight: 1.5 }}>
          {d.hookHeadline}
        </div>

        {/* CTA driving swipe to next slide */}
        <div style={{ marginTop: 14, display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 20, padding: "6px 13px", fontSize: 9.5, fontWeight: 800, color: T.gold, letterSpacing: 0.5 }}>
          👀 Swipe for clues →
        </div>

        <div style={{ marginTop: 12, fontSize: 9, color: T.muted, fontWeight: 500, lineHeight: 1.5 }}>{d.subtitle}</div>
      </div>

      <Brand name={d.brand} color={T.muted} />
      <SaveForLater color={T.muted} />
    </div>
  );
}

function RadarSlide2({ d }) {
  const clues = (d.clues && d.clues.length ? d.clues : []).slice(0, 3);
  return (
    <div style={{ ...slideBase, padding: "20px 24px 50px", background: "#09090f" }}>
      <GridOverlay />
      <div style={{ position: "absolute", bottom: -60, left: -60, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.13) 0%, transparent 60%)", zIndex: 0 }} />
      <CornerMark color={T.gold} />
      <SlideNum n={2} color={T.muted} />

      <div style={{ position: "relative", zIndex: 2, textAlign: "left" }}>
        <RadarBadge />

        <div style={{ marginTop: 16, fontSize: 18, fontWeight: 900, lineHeight: 1.3, letterSpacing: -0.3 }}>
          Can you guess this {d.exchange || "NSE"} stock in 3 clues?
        </div>

        {clues.length > 0 && (
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
            {clues.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "10px 12px" }}>
                <span style={{ fontSize: 15, flexShrink: 0 }}>{c.icon}</span>
                <div style={{ fontSize: 11, fontWeight: 600, color: T.mutedLight, lineHeight: 1.4 }}>{c.text}</div>
              </div>
            ))}
          </div>
        )}

        {/* CTA driving comments + swipe to reveal */}
        <div style={{ marginTop: 14, display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 20, padding: "6px 13px", fontSize: 9.5, fontWeight: 800, color: T.gold, letterSpacing: 0.5 }}>
          👀 Reveal on next slide →
        </div>
      </div>

      <Brand name={d.brand} color={T.muted} />
      <SaveForLater color={T.muted} />
    </div>
  );
}

function RadarSlide3({ d, chartImg }) {
  return (
    <div style={{ ...slideBase, padding: "16px 18px 36px" }}>
      <CornerMark color={T.gold} />
      <SlideNum n={3} color={T.muted} />
      <div style={{ position: "relative", zIndex: 2 }}>
        <RadarBadge />
        <div style={{ marginTop: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 14, fontWeight: 900, letterSpacing: -0.3 }}>CHART <span style={{ color: T.gold }}>IN FOCUS</span></div>
          <div style={{ fontSize: 9, fontWeight: 800, color: T.gold, letterSpacing: 1.5, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 20, padding: "3px 10px" }}>🎯 REVEALED</div>
        </div>
        <div style={{ marginTop: 8, borderRadius: 10, overflow: "hidden", height: 206, background: T.surface, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {chartImg
            ? <img src={chartImg} alt="chart" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            : <div style={{ textAlign: "center", color: T.muted, fontSize: 12 }}><div style={{ fontSize: 24, marginBottom: 4 }}>📡</div>Upload chart</div>
          }
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 10, alignItems: "stretch" }}>
          {/* Ticker chip */}
          <div style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 10, padding: "10px 16px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontSize: 7.5, color: T.muted, fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>TICKER</div>
            <div style={{ fontSize: 10, fontWeight: 800, color: T.gold, letterSpacing: -0.5 }}>{d.ticker}</div>
          </div>
          {/* Zone status */}
          <div style={{ flex: 1, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "10px 14px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontSize: 7.5, color: T.muted, fontWeight: 700, letterSpacing: 1, marginBottom: 5 }}>ZONE STATUS</div>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: d.zoneColor || T.gold, boxShadow: `0 0 8px ${d.zoneColor || T.gold}`, flexShrink: 0 }} />
              <div style={{ fontSize: 10, fontWeight: 800, color: d.zoneColor || T.gold, letterSpacing: 0.3 }}>{d.zone}</div>
            </div>
          </div>
        </div>
      </div>
      <Brand name={d.brand} />
    </div>
  );
}

function RadarSlide4({ d }) {
  return (
    <div style={{ ...slideBase, padding: "20px 22px 36px" }}>
      <GridOverlay />
      <div style={{ position: "absolute", bottom: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.14) 0%, transparent 65%)", zIndex: 0 }} />
      <CornerMark color={T.gold} />
      <SlideNum n={4} color={T.muted} />
      <div style={{ position: "relative", zIndex: 2 }}>
        <RadarBadge />
        <div style={{ marginTop: 10, fontSize: 15, fontWeight: 900, letterSpacing: -0.3 }}>THE <span style={{ color: T.gold }}>SETUP</span></div>
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 9 }}>
          {d.setupPoints.map((p, i) => (
            <div key={i} style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
              <div style={{ width: 26, height: 26, borderRadius: 7, flexShrink: 0, background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, color: T.gold }}>{i + 1}</div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 10.5, fontWeight: 800, color: T.white, marginBottom: 2 }}>{p.title}</div>
                <div style={{ fontSize: 9.5, color: T.muted, lineHeight: 1.55, fontWeight: 500 }}>{p.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.22)", borderRadius: 10, padding: "9px 12px" }}>
          <div style={{ fontSize: 9.5, fontWeight: 700, color: T.gold, marginBottom: 3 }}>💡 Risk Note</div>
          <div style={{ fontSize: 9.5, color: T.muted, lineHeight: 1.6, fontWeight: 500 }}>{d.riskNote}</div>
        </div>
      </div>
      <Brand name={d.brand} />
      <SaveForLater color={T.muted} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   REVIEW SLIDES
═══════════════════════════════════════════════════════════ */
function ReviewSlide1({ d }) {
  const isWin = d.outcome === "WIN";
  return (
    <div style={{ ...slideBase, padding: "22px 24px 36px" }}>
      <GridOverlay />
      <div style={{ position: "absolute", top: -50, right: -30, width: 220, height: 220, borderRadius: "50%", background: `radial-gradient(circle, ${isWin ? "rgba(16,185,129,0.14)" : "rgba(239,68,68,0.12)"} 0%, transparent 65%)`, zIndex: 0 }} />
      <CornerMark color={isWin ? T.green : T.red} />
      <SlideNum n={1} color={T.muted} />
      <div style={{ position: "relative", zIndex: 2, textAlign: "left" }}>
        <ReviewBadge />
        <div style={{ marginTop: 20, lineHeight: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>{d.ticker} · {d.period}</div>
          <div style={{ fontSize: 38, fontWeight: 900, letterSpacing: -1.5, color: T.white }}>{d.titleLine1}</div>
          <div style={{ fontSize: 38, fontWeight: 900, letterSpacing: -1.5, color: T.white }}>{d.titleLine2}</div>
          <div style={{ fontSize: 38, fontWeight: 900, letterSpacing: -1.5, color: isWin ? T.green : T.red }}>{d.titleHighlight}</div>
        </div>
        <div style={{ marginTop: 18, display: "inline-flex", alignItems: "center", gap: 8, background: isWin ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)", border: `1px solid ${isWin ? "rgba(16,185,129,0.35)" : "rgba(239,68,68,0.35)"}`, borderRadius: 20, padding: "7px 16px" }}>
          <span style={{ fontSize: 14 }}>{isWin ? "✅" : "❌"}</span>
          <span style={{ fontSize: 12, fontWeight: 800, color: isWin ? T.green : T.red }}>{d.outcome}</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: T.white }}>{d.returnPct}</span>
        </div>
        <div style={{ marginTop: 16, color: T.muted, fontSize: 11, lineHeight: 1.75, fontWeight: 500, maxWidth: 270 }}>{d.subtitle}</div>
      </div>
      <Brand name={d.brand} />
      <SaveForLater color={T.muted} />
    </div>
  );
}

function ReviewSlide2({ d, chartImg }) {
  return (
    <div style={{ ...slideBase, padding: "16px 18px 36px" }}>
      <CornerMark color={T.green} />
      <SlideNum n={2} color={T.muted} />
      <div style={{ position: "relative", zIndex: 2 }}>
        <ReviewBadge />
        <div style={{ marginTop: 8, fontSize: 14, fontWeight: 900, letterSpacing: -0.3 }}>THE TRADE <span style={{ color: T.green }}>REVIEWED</span></div>
        <div style={{ marginTop: 8, borderRadius: 10, overflow: "hidden", height: 212, background: T.surface, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {chartImg
            ? <img src={chartImg} alt="chart" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            : <div style={{ textAlign: "center", color: T.muted, fontSize: 12 }}><div style={{ fontSize: 24, marginBottom: 4 }}>📋</div>Upload review chart</div>
          }
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 9 }}>
          {[
            { label: "ENTRY",  val: d.entryPrice, color: T.blueBright },
            { label: "EXIT",   val: d.exitPrice,  color: T.green },
            { label: "RETURN", val: d.returnPct,  color: d.outcome === "WIN" ? T.green : T.red },
            { label: "DAYS",   val: d.holdDays,   color: T.mutedLight },
          ].map((item, i) => (
            <div key={i} style={{ flex: 1, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "7px 8px" }}>
              <div style={{ fontSize: 7.5, color: T.muted, fontWeight: 700, marginBottom: 3, letterSpacing: 1 }}>{item.label}</div>
              <div style={{ fontSize: 10, fontWeight: 800, color: item.color }}>{item.val}</div>
            </div>
          ))}
        </div>
      </div>
      <Brand name={d.brand} />
    </div>
  );
}

function ReviewSlide3({ d }) {
  return (
    <div style={{ ...slideBase, padding: "20px 22px 36px" }}>
      <GridOverlay />
      <div style={{ position: "absolute", bottom: -40, left: -40, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.13) 0%, transparent 65%)", zIndex: 0 }} />
      <CornerMark color={T.green} />
      <SlideNum n={3} color={T.muted} />
      <div style={{ position: "relative", zIndex: 2 }}>
        <ReviewBadge />
        <div style={{ marginTop: 10, fontSize: 15, fontWeight: 900, letterSpacing: -0.3 }}>KEY <span style={{ color: T.green }}>LEARNINGS</span></div>
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 7 }}>
          {d.learnings.map((l, i) => (
            <div key={i} style={{ display: "flex", gap: 11, alignItems: "flex-start", padding: "9px 11px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10 }}>
              <div style={{ fontSize: 17, flexShrink: 0, lineHeight: 1 }}>{l.icon}</div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 10.5, fontWeight: 800, marginBottom: 2 }}>{l.title}</div>
                <div style={{ fontSize: 9.5, color: T.muted, lineHeight: 1.55, fontWeight: 500 }}>{l.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 11, borderLeft: `3px solid ${T.green}`, paddingLeft: 11 }}>
          <div style={{ fontSize: 10, fontStyle: "italic", color: T.mutedLight, lineHeight: 1.65, fontWeight: 500 }}>"{d.quote}"</div>
        </div>
      </div>
      <Brand name={d.brand} />
      <SaveForLater color={T.muted} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   BREAKDOWN SLIDES  — Chart Pattern Breakdown
   3 slides: Hook (raw chart) → Reveal (annotated) → Playbook
═══════════════════════════════════════════════════════════ */

/* Slide 1 — HOOK: raw chart + big teaser question */
function BdSlide1({ d, chartImg }) {
  return (
    <div style={{ ...slideBase, padding: "16px 18px 36px", background: "#0b0c14" }}>
      {/* Violet radial glow top-left */}
      <div style={{ position: "absolute", top: -60, left: -60, width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 65%)", zIndex: 0 }} />
      <CornerMark color={T.violet} />
      <SlideNum n={1} color={T.muted} />

      <div style={{ position: "relative", zIndex: 2 }}>
        <BreakdownBadge />

        {/* Teaser question — the engagement hook */}
        <div style={{ marginTop: 10, fontSize: 13, fontWeight: 900, letterSpacing: -0.3, lineHeight: 1.25 }}>
          {d.hookQuestion.split("\\n").map((line, i) => (
            <div key={i}>
              {i === 0 ? line : <span style={{ color: T.violet }}>{line}</span>}
            </div>
          ))}
        </div>

        {/* Chart image */}
        <div style={{
          marginTop: 10, borderRadius: 10, overflow: "hidden",
          height: 200, background: T.surface, border: `1px solid rgba(139,92,246,0.25)`,
          display: "flex", alignItems: "center", justifyContent: "center", position: "relative",
        }}>
          {chartImg
            ? <img src={chartImg} alt="chart" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            : <div style={{ textAlign: "center", color: T.muted, fontSize: 11 }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>🔍</div>
                Upload your chart screenshot
              </div>
          }
        </div>

        {/* Brief description */}
        {d.hookDesc && (
          <div style={{ marginTop: 10, fontSize: 10, color: T.mutedLight, lineHeight: 1.6, fontWeight: 500 }}>{d.hookDesc}</div>
        )}

      </div>
      <Brand name={d.brand} />
    </div>
  );
}

/* Slide 2 — REVEAL: real ticker chart, no annotations */
function BdSlide2({ d, chart2Img }) {
  return (
    <div style={{ ...slideBase, padding: "16px 18px 36px", background: "#0b0c14" }}>
      <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 65%)", zIndex: 0 }} />
      <CornerMark color={T.violet} />
      <SlideNum n={2} color={T.muted} />

      <div style={{ position: "relative", zIndex: 2 }}>
        <BreakdownBadge />
        <div style={{ marginTop: 8, fontSize: 14, fontWeight: 900, letterSpacing: -0.3 }}>
          REAL <span style={{ color: T.violet }}>EXAMPLE</span>
        </div>

        {/* Real ticker chart — clean, no overlays */}
        <div style={{
          marginTop: 8, borderRadius: 10, overflow: "hidden",
          height: 210, background: T.surface,
          border: `1px solid rgba(139,92,246,0.3)`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {chart2Img
            ? <img src={chart2Img} alt="chart" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            : <div style={{ textAlign: "center", color: T.muted, fontSize: 11 }}><div style={{ fontSize: 24, marginBottom: 4 }}>📈</div>Upload real ticker chart</div>
          }
        </div>

        {/* Ticker + pattern + timeframe stats */}
        <div style={{ display: "flex", gap: 6, marginTop: 9 }}>
          {[
            { label: "TICKER",    val: d.ticker,      color: T.violet },
            { label: "PATTERN",   val: d.patternName, color: T.gold },
            { label: "TIMEFRAME", val: d.timeframe,   color: T.mutedLight },
          ].map((item, i) => (
            <div key={i} style={{ flex: 1, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "7px 6px" }}>
              <div style={{ fontSize: 7, color: T.muted, fontWeight: 700, marginBottom: 3, letterSpacing: 0.8 }}>{item.label}</div>
              <div style={{ fontSize: 9.5, fontWeight: 800, color: item.color, lineHeight: 1.2 }}>{item.val}</div>
            </div>
          ))}
        </div>
      </div>
      <Brand name={d.brand} />
    </div>
  );
}

/* Slide 3 — PLAYBOOK: how to trade this pattern */
function BdSlide3({ d }) {
  return (
    <div style={{ ...slideBase, padding: "20px 22px 52px", background: "#0b0c14" }}>
      <GridOverlay />
      <div style={{ position: "absolute", bottom: -40, left: -40, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.13) 0%, transparent 65%)", zIndex: 0 }} />
      <CornerMark color={T.violet} />
      <SlideNum n={3} color={T.muted} />

      <div style={{ position: "relative", zIndex: 2 }}>
        <BreakdownBadge />
        <div style={{ marginTop: 10, fontSize: 15, fontWeight: 900, letterSpacing: -0.3 }}>
          THE <span style={{ color: T.violet }}>PLAYBOOK</span>
        </div>

        {/* Entry / Stop / Target chips */}
        <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
          {[
            { label: "ENTRY TRIGGER", val: d.entryTrigger, color: T.violet },
            { label: "STOP",          val: d.stop,          color: T.red },
            { label: "TARGET",        val: d.target,        color: T.green },
          ].map((item, i) => (
            <div key={i} style={{ flex: 1, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "8px 8px" }}>
              <div style={{ fontSize: 7, color: T.muted, fontWeight: 700, marginBottom: 4, letterSpacing: 0.8 }}>{item.label}</div>
              <div style={{ fontSize: 9.5, fontWeight: 800, color: item.color, lineHeight: 1.3 }}>{item.val}</div>
            </div>
          ))}
        </div>

        {/* Rules — 3 clean rows */}
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
          {d.rules.map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "9px 11px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10 }}>
              <div style={{
                width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 900, color: T.violet,
              }}>{i + 1}</div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 10.5, fontWeight: 800, color: T.white, marginBottom: 2 }}>{r.title}</div>
                <div style={{ fontSize: 9.5, color: T.muted, lineHeight: 1.5, fontWeight: 500 }}>{r.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Quote — kept above brand bar with enough margin */}
        {/* <div style={{ marginTop: 10, borderLeft: `3px solid ${T.violet}`, paddingLeft: 10 }}>
          <div style={{ fontSize: 9.5, fontStyle: "italic", color: T.mutedLight, lineHeight: 1.6 }}>"{d.quote}"</div>
        </div> */}
      </div>
      <Brand name={d.brand} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CONCEPT CARD SLIDES — single-slide bite-size education
   2 slides: The card itself + Disclaimer
═══════════════════════════════════════════════════════════ */

/* Slide 1 — Concept intro: heading + short description */
function CcSlide1({ d }) {
  return (
    <div style={{ ...slideBase, padding: "22px 22px 56px", background: "#080c10" }}>
      {/* Cyan glow top-right */}
      <div style={{ position: "absolute", top: -50, right: -50, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,0.16) 0%, transparent 65%)", zIndex: 0 }} />
      <GridOverlay />
      <CornerMark color={T.cyan} />
      <SlideNum n={1} color={T.muted} />

      <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column" }}>
        <ConceptBadge />

        {/* Concept name — large */}
        <div style={{ marginTop: 28 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: T.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Today's Concept</div>
          <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: -1.2, lineHeight: 1.05, color: T.white }}>
            {d.conceptName.split(" ").map((word, i, arr) =>
              i === arr.length - 1
                ? <span key={i} style={{ color: T.cyan }}>{word}</span>
                : <span key={i}>{word} </span>
            )}
          </div>
        </div>

        {/* Short definition */}
        <div style={{ marginTop: 16, background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.25)", borderRadius: 12, padding: "14px 16px" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: T.white, lineHeight: 1.65 }}>{d.definition}</div>
        </div>

        {/* Analogy */}
        <div style={{ marginTop: 12, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "10px 14px" }}>
          <div style={{ fontSize: 9, fontWeight: 800, color: T.cyan, letterSpacing: 1.2, marginBottom: 5 }}>💡 THINK OF IT LIKE THIS</div>
          <div style={{ fontSize: 10.5, color: T.mutedLight, lineHeight: 1.55, fontWeight: 500 }}>{d.analogy}</div>
        </div>
      </div>

      <Brand name={d.brand} />
      <SaveForLater color={T.muted} />
    </div>
  );
}

/* Slide 2 — Concept detail: bullet points */
function CcSlide2({ d }) {
  return (
    <div style={{ ...slideBase, padding: "22px 22px 36px", background: "#080c10" }}>
      <div style={{ position: "absolute", bottom: -50, left: -50, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,0.13) 0%, transparent 65%)", zIndex: 0 }} />
      <GridOverlay />
      <CornerMark color={T.cyan} />
      <SlideNum n={2} color={T.muted} />

      <div style={{ position: "relative", zIndex: 2, height: "100%", display: "flex", flexDirection: "column" }}>
        <ConceptBadge />

        <div style={{ marginTop: 14, fontSize: 15, fontWeight: 900, letterSpacing: -0.3 }}>
          KEY <span style={{ color: T.cyan }}>POINTS</span>
        </div>

        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
          {d.keyPoints.map((pt, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 12px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10 }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, flexShrink: 0, marginTop: 0, background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900, color: T.cyan }}>{i + 1}</div>
              <div style={{ fontSize: 10.5, color: T.mutedLight, lineHeight: 1.6, fontWeight: 500 }}>{pt}</div>
            </div>
          ))}
        </div>
      </div>

      <Brand name={d.brand} />
      <SaveForLater color={T.muted} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MARKET VIEWS SLIDES — Opinion-first, tension-driven carousel
   4 slides: Statement → Common Belief → Your View → Question
═══════════════════════════════════════════════════════════ */

/* Slide 1 — STATEMENT: the bold claim that stops the scroll */
function MvSlide1({ d }) {
  return (
    <div style={{ ...slideBase, padding: "22px 24px 36px", background: "#0d0b0b" }}>
      {/* Red radial glow top-right */}
      <div style={{ position: "absolute", top: -60, right: -60, width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle, rgba(239,68,68,0.18) 0%, transparent 65%)", zIndex: 0 }} />
      <div style={{ position: "absolute", bottom: -40, left: -40, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(239,68,68,0.08) 0%, transparent 65%)", zIndex: 0 }} />
      <CornerMark color={T.red} />
      <SlideNum n={1} color="rgba(239,68,68,0.5)" />
      <div style={{ position: "relative", zIndex: 2, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <MarketViewsBadge />
          {/* Big provocative statement */}
          <div style={{ marginTop: 26, lineHeight: 1.05 }}>
            {d.statement.split("\\n").map((line, i) => (
              <div key={i} style={{
                fontSize: i === 0 ? 38 : 36,
                fontWeight: 900,
                letterSpacing: -1.5,
                color: i === d.statement.split("\\n").length - 1 ? T.red : T.white,
              }}>{line}</div>
            ))}
          </div>
          {/* Thin red underline accent */}
          <div style={{ marginTop: 18, width: 40, height: 3, background: T.red, borderRadius: 2 }} />
          {d.statementSub && (
            <div style={{ marginTop: 12, fontSize: 11, color: T.muted, fontWeight: 500, lineHeight: 1.65, maxWidth: 260 }}>{d.statementSub}</div>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 10, fontWeight: 700, color: "rgba(239,68,68,0.7)" }}>
          <div style={{ width: 20, height: 20, borderRadius: "50%", border: "1.5px solid rgba(239,68,68,0.5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9 }}>→</div>
          Swipe — agree or disagree?
        </div>
      </div>
      <Brand name={d.brand} color={T.muted} />
    </div>
  );
}

/* Slide 2 — COMMON BELIEF: what most people think (sets up the tension) */
function MvSlide2({ d }) {
  return (
    <div style={{ ...slideBase, padding: "22px 24px 36px", background: "#0d0b0b" }}>
      <GridOverlay />
      <CornerMark color={T.red} />
      <SlideNum n={2} color="rgba(239,68,68,0.5)" />
      <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", height: "calc(100% - 36px)" }}>
        <div>
          <MarketViewsBadge />
          <div style={{ marginTop: 14, fontSize: 10, fontWeight: 800, color: T.muted, letterSpacing: 2, textTransform: "uppercase" }}>
            What most traders believe
          </div>
          {/* The "crowd" belief — large quote block, more breathing room */}
          <div style={{ marginTop: 12, background: "rgba(255,255,255,0.04)", border: `1px solid ${T.borderLight}`, borderRadius: 14, padding: "22px 18px 18px", position: "relative" }}>
            <div style={{ position: "absolute", top: -4, left: 14, fontSize: 52, color: "rgba(255,255,255,0.07)", fontWeight: 900, lineHeight: 1, fontFamily: "Georgia, serif" }}>"</div>
            <div style={{ fontSize: 14.5, fontWeight: 700, color: T.white, lineHeight: 1.6 }}>{d.commonBelief}</div>
          </div>
        </div>

        {/* Tension teaser — pushed to bottom, acts as the cliffhanger before slide 3 */}
        <div style={{ marginTop: "auto", paddingTop: 20 }}>
          <div style={{ height: 1, background: "rgba(239,68,68,0.15)", marginBottom: 16 }} />
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0, marginTop: 2 }}>⚡</span>
            <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(239,68,68,0.9)", lineHeight: 1.55 }}>
              {d.tensionTeaser || "I used to think the same. Then I looked closer."}
            </div>
          </div>
        </div>
      </div>
      <Brand name={d.brand} color={T.muted} />
      <SaveForLater color={T.muted} />
    </div>
  );
}
function MvSlide3({ d }) {
  return (
    <div style={{ ...slideBase, padding: "22px 24px 36px", background: "#0d0b0b" }}>
      {/* Red glow bottom-left */}
      <div style={{ position: "absolute", bottom: -50, left: -50, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(239,68,68,0.15) 0%, transparent 65%)", zIndex: 0 }} />
      <CornerMark color={T.red} />
      <SlideNum n={3} color="rgba(239,68,68,0.5)" />
      <div style={{ position: "relative", zIndex: 2 }}>
        <MarketViewsBadge />
        <div style={{ marginTop: 14, fontSize: 10, fontWeight: 800, color: T.red, letterSpacing: 2, textTransform: "uppercase" }}>
          My view
        </div>
        {/* View points — each line is a conviction statement */}
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 10 }}>
          {d.viewPoints.map((pt, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: T.red, flexShrink: 0, marginTop: 6 }} />
              <div style={{ fontSize: 13, fontWeight: 700, color: T.white, lineHeight: 1.5 }}>{pt}</div>
            </div>
          ))}
        </div>
        {/* Context note */}
        {d.contextNote && (
          <div style={{ marginTop: 18, borderLeft: `3px solid rgba(239,68,68,0.5)`, paddingLeft: 12 }}>
            <div style={{ fontSize: 10.5, fontStyle: "italic", color: T.mutedLight, lineHeight: 1.7, fontWeight: 500 }}>{d.contextNote}</div>
          </div>
        )}
      </div>
      <Brand name={d.brand} color={T.muted} />
    </div>
  );
}

/* Slide 4 — QUESTION: flip it back, drive comments */
function MvSlide4({ d }) {
  return (
    <div style={{ ...slideBase, padding: "22px 24px 36px", background: "#0d0b0b" }}>
      <GridOverlay />
      <div style={{ position: "absolute", top: -50, left: -50, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(239,68,68,0.12) 0%, transparent 65%)", zIndex: 0 }} />
      <CornerMark color={T.red} />
      <SlideNum n={4} color="rgba(239,68,68,0.5)" />
      <div style={{ position: "relative", zIndex: 2, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <MarketViewsBadge />
          {/* The question — big, direct */}
          <div style={{ marginTop: 20, fontSize: 28, fontWeight: 900, letterSpacing: -1, lineHeight: 1.15, color: T.white }}>
            {d.question}
          </div>
          {/* Binary "camps" — encourages picking a side */}
          <div style={{ marginTop: 22, display: "flex", gap: 10 }}>
            <div style={{ flex: 1, background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.35)", borderRadius: 12, padding: "12px 14px", textAlign: "center" }}>
              <div style={{ fontSize: 16, marginBottom: 4 }}>{d.sideA?.emoji || "🔴"}</div>
              <div style={{ fontSize: 10.5, fontWeight: 800, color: T.red, lineHeight: 1.35 }}>{d.sideA?.label || "Agree"}</div>
            </div>
            <div style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: `1px solid ${T.borderLight}`, borderRadius: 12, padding: "12px 14px", textAlign: "center" }}>
              <div style={{ fontSize: 16, marginBottom: 4 }}>{d.sideB?.emoji || "🟢"}</div>
              <div style={{ fontSize: 10.5, fontWeight: 800, color: T.mutedLight, lineHeight: 1.35 }}>{d.sideB?.label || "Disagree"}</div>
            </div>
          </div>
          {/* Closing quote */}
          {d.closingQuote && (
            <div style={{ marginTop: 18, borderLeft: `3px solid rgba(239,68,68,0.4)`, paddingLeft: 12 }}>
              <div style={{ fontSize: 10.5, fontStyle: "italic", color: T.mutedLight, lineHeight: 1.7, fontWeight: 500 }}>{d.closingQuote}</div>
            </div>
          )}
        </div>
      </div>
      <Brand name={d.brand} color={T.muted} />
      <SaveForLater color={T.muted} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   RADAR REEL SLIDES — Vertical 1080x1920 Instagram Reel
   Separate canvas (REEL_W x REEL_H), gold/dark Radar theme.
   Safe zones: 120px top, 180px bottom — all critical text sits inside.
═══════════════════════════════════════════════════════════ */

/* Reusable footer for reel scenes — sits above the 180px bottom safe line.
   Rendered as a normal flex child (not absolutely positioned) so it never
   overlaps content that grows via marginTop: "auto". */
function ReelFooter({ brand = "CANDLEWISE", style }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, flexShrink: 0, ...style }}>
      <span style={{ fontSize: 28, opacity: 0.8, color: T.gold }}>▲</span>
      <span style={{ fontSize: 26, fontWeight: 800, letterSpacing: 4, color: T.mutedLight, textTransform: "uppercase" }}>{brand}</span>
    </div>
  );
}

function ReelGlow({ style }) {
  return <div style={{ position: "absolute", borderRadius: "50%", zIndex: 0, ...style }} />;
}

/* Scene 1 — HOOK */
function RadarReelSlide1({ d }) {
  return (
    <div style={{ ...reelSlideBase, padding: "0 64px" }}>
      <GridOverlay />
      <ReelGlow style={{ top: -160, right: -160, width: 760, height: 760, background: "radial-gradient(circle, rgba(245,158,11,0.16) 0%, transparent 65%)" }} />
      <ReelGlow style={{ bottom: -200, left: -180, width: 700, height: 700, background: "radial-gradient(circle, rgba(245,158,11,0.10) 0%, transparent 65%)" }} />

      <div style={{ position: "relative", zIndex: 2, height: "100%", display: "flex", flexDirection: "column", paddingTop: 160, paddingBottom: 100 }}>
        <RadarReelBadge scale={2.6} />

        {/* Headline */}
        <div style={{ marginTop: 64, fontSize: 84, fontWeight: 900, lineHeight: 1.08, letterSpacing: -2, color: T.white }}>
          {(d.title || "3 Stocks On My Radar This Week").split("\n").map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>

        {/* Optional sub-headline */}
        <div style={{ marginTop: 28, fontSize: 38, fontWeight: 600, color: T.mutedLight, lineHeight: 1.5, maxWidth: 820 }}>
          {d.subheadline || "Swipe to see which stocks are on the list"}
        </div>

        {/* Big animated-style numbers */}
        <div style={{ marginTop: 64, display: "flex", gap: 36, alignItems: "center" }}>
          {["#1", "#2", "#3"].map((n, i) => (
            <div key={i} style={{
              fontSize: 120, fontWeight: 900, letterSpacing: -4, lineHeight: 1,
              color: i === 0 ? T.gold : "transparent",
              WebkitTextStroke: i === 0 ? "none" : `3px ${T.gold}`,
              opacity: i === 0 ? 1 : 0.55,
            }}>{n}</div>
          ))}
        </div>

        {/* Week label */}
        {d.weekLabel && (
          <div style={{ marginTop: 28, fontSize: 32, fontWeight: 700, color: T.muted, letterSpacing: 2 }}>{d.weekLabel}</div>
        )}

        {/* Bottom CTA */}
        <div style={{ marginTop: 44, display: "inline-flex", alignItems: "center", gap: 16, background: "rgba(245,158,11,0.12)", border: "2px solid rgba(245,158,11,0.35)", borderRadius: 60, padding: "20px 44px", width: "fit-content" }}>
          <span style={{ fontSize: 44, fontWeight: 900, color: T.gold, letterSpacing: 2 }}>Swipe →</span>
        </div>

        <ReelFooter brand={d.brand} style={{ marginTop: 60 }} />
      </div>
    </div>
  );
}

/* Shared layout for Scenes 2–4 (Stock 1 / 2 / 3) */
function RadarReelStockSlide({ n, ticker, company, clue1, clue2, clue3, brand, sceneNum }) {
  return (
    <div style={{ ...reelSlideBase, padding: "0 64px" }}>
      <GridOverlay />
      <ReelGlow style={{ top: -180, left: -180, width: 720, height: 720, background: "radial-gradient(circle, rgba(245,158,11,0.13) 0%, transparent 65%)" }} />
      <ReelGlow style={{ bottom: -220, right: -160, width: 680, height: 680, background: "radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 65%)" }} />

      <div style={{ position: "relative", zIndex: 2, height: "100%", display: "flex", flexDirection: "column", paddingTop: 160, paddingBottom: 100 }}>
        <RadarReelBadge scale={2.6} />

        {/* Top label — STOCK #N */}
        <div style={{ marginTop: 48, fontSize: 40, fontWeight: 800, letterSpacing: 6, color: T.muted, textTransform: "uppercase" }}>
          STOCK <span style={{ color: T.gold }}>#{n}</span>
        </div>

        {/* Clue cards */}
        <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 20 }}>
          {[clue1, clue2, clue3].map((clue, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 22, background: "rgba(255,255,255,0.04)", border: `2px solid ${T.borderLight}`, borderRadius: 24, padding: "24px 32px" }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, flexShrink: 0, background: "rgba(245,158,11,0.12)", border: "2px solid rgba(245,158,11,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 900, color: T.gold }}>
                {i + 1}
              </div>
              <div style={{ fontSize: 38, fontWeight: 600, color: T.white, lineHeight: 1.4, paddingTop: 6 }}>
                {clue || `Clue ${i + 1}`}
              </div>
            </div>
          ))}
        </div>

        {/* Ticker section */}
        <div style={{ marginTop: 48, display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: 5, color: T.muted, textTransform: "uppercase" }}>On the radar</div>
          <div style={{
            fontSize: 96, fontWeight: 900, letterSpacing: -3, lineHeight: 1.05,
            color: T.gold, wordBreak: "break-word",
          }}>{ticker || "TICKER"}</div>
          {company && (
            <div style={{ fontSize: 34, fontWeight: 600, color: T.mutedLight, marginTop: -8 }}>{company}</div>
          )}
          <div style={{ marginTop: 8, display: "inline-flex", alignItems: "center", gap: 16, background: "rgba(245,158,11,0.12)", border: "2px solid rgba(245,158,11,0.35)", borderRadius: 60, padding: "18px 38px", width: "fit-content" }}>
            <div style={{ width: 16, height: 16, borderRadius: "50%", background: T.gold, boxShadow: `0 0 16px ${T.gold}` }} />
            <span style={{ fontSize: 32, fontWeight: 800, letterSpacing: 3, color: T.gold }}>WATCHING CLOSELY</span>
          </div>
        </div>

        {/* Bottom note */}
        <div style={{ textAlign: "center", marginTop: 48, marginBottom: 28 }}>
          <div style={{ fontSize: 28, fontWeight: 600, color: T.muted, letterSpacing: 1 }}>Full analysis available on profile</div>
        </div>
        <ReelFooter brand={brand} />
      </div>
    </div>
  );
}

/* Scene 2 — Stock 1 */
function RadarReelSlide2({ d }) {
  return (
    <RadarReelStockSlide
      n={1} sceneNum={2}
      ticker={d.stock1Ticker} company={d.stock1Company}
      clue1={d.stock1Clue1} clue2={d.stock1Clue2} clue3={d.stock1Clue3}
      brand={d.brand}
    />
  );
}

/* Scene 3 — Stock 2 */
function RadarReelSlide3({ d }) {
  return (
    <RadarReelStockSlide
      n={2} sceneNum={3}
      ticker={d.stock2Ticker} company={d.stock2Company}
      clue1={d.stock2Clue1} clue2={d.stock2Clue2} clue3={d.stock2Clue3}
      brand={d.brand}
    />
  );
}

/* Scene 4 — Stock 3 */
function RadarReelSlide4({ d }) {
  return (
    <RadarReelStockSlide
      n={3} sceneNum={4}
      ticker={d.stock3Ticker} company={d.stock3Company}
      clue1={d.stock3Clue1} clue2={d.stock3Clue2} clue3={d.stock3Clue3}
      brand={d.brand}
    />
  );
}

/* Scene 5 — CTA */
function RadarReelSlide5({ d }) {
  const tickers = [d.stock1Ticker, d.stock2Ticker, d.stock3Ticker].filter(Boolean);
  return (
    <div style={{ ...reelSlideBase, padding: "0 64px" }}>
      <GridOverlay />
      <ReelGlow style={{ top: -180, right: -180, width: 760, height: 760, background: "radial-gradient(circle, rgba(245,158,11,0.16) 0%, transparent 65%)" }} />
      <ReelGlow style={{ bottom: -220, left: -180, width: 700, height: 700, background: "radial-gradient(circle, rgba(245,158,11,0.10) 0%, transparent 65%)" }} />

      <div style={{ position: "relative", zIndex: 2, height: "100%", display: "flex", flexDirection: "column", paddingTop: 140, paddingBottom: 60 }}>
        <RadarReelBadge scale={2.6} />

        {/* Headline */}
        <div style={{ marginTop: 40, fontSize: 64, fontWeight: 900, lineHeight: 1.12, letterSpacing: -1.5, color: T.white }}>
          Want To Know Why These Stocks Made My <span style={{ color: T.gold }}>Watchlist?</span>
        </div>

        {/* This week's watchlist recap */}
        {tickers.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: 5, color: T.muted, textTransform: "uppercase", marginBottom: 14 }}>This week's watchlist</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {tickers.map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, background: "rgba(255,255,255,0.04)", border: `2px solid ${T.borderLight}`, borderRadius: 18, padding: "16px 26px" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0, background: "rgba(245,158,11,0.12)", border: "2px solid rgba(245,158,11,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 900, color: T.gold }}>
                    {i + 1}
                  </div>
                  <span style={{ fontSize: 38, fontWeight: 800, color: T.white, letterSpacing: -0.5 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Large CTA card */}
        <div style={{ marginTop: 32, background: "rgba(245,158,11,0.1)", border: "3px solid rgba(245,158,11,0.35)", borderRadius: 28, padding: "32px 36px" }}>
          <div style={{ fontSize: 52, fontWeight: 900, color: T.gold, letterSpacing: -1.5, lineHeight: 1.2 }}>
            {d.ctaText || "Check the latest carousel posts"}
          </div>
          <div style={{ marginTop: 20, display: "flex", flexWrap: "wrap", gap: 12 }}>
            {["Full breakdown", "Chart setup", "Risk levels", "Trade thesis"].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(0,0,0,0.2)", borderRadius: 40, padding: "8px 18px" }}>
                <div style={{ width: 9, height: 9, borderRadius: "50%", background: T.gold, flexShrink: 0 }} />
                <span style={{ fontSize: 28, fontWeight: 700, color: T.white }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTAs */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 32, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, background: "rgba(255,255,255,0.05)", border: `2px solid ${T.borderLight}`, borderRadius: 60, padding: "18px 32px" }}>
            <span style={{ fontSize: 34 }}>📌</span>
            <span style={{ fontSize: 32, fontWeight: 800, color: T.white }}>Follow @candlewise.hq</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, background: "rgba(245,158,11,0.12)", border: "2px solid rgba(245,158,11,0.35)", borderRadius: 60, padding: "18px 32px" }}>
            <span style={{ fontSize: 34 }}>🔖</span>
            <span style={{ fontSize: 32, fontWeight: 800, color: T.gold }}>Save this reel</span>
          </div>
        </div>
        <ReelFooter brand={d.brand} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DEFAULT DATA
═══════════════════════════════════════════════════════════ */
const DEFAULT_EDU = {
  brand: "CANDLEWISE",
  titleLine1: "VOLUME", titleLine2: "ALWAYS", titleHighlight: "SPEAKS",
  subtitle: "Understand how volume expansion reveals smart money participation.",
  chartTopLabel: "Strong Upswing +82.5 (62.4%)", chartBottomLabel: "Volume Expansion",
  chartCaption: "This historical chart shows a classic volume expansion breakout. Notice how price accelerated sharply as volume surged above average — a textbook example of institutional participation.",
  whyPoints: [
    { icon: "📊", bg: "rgba(16,185,129,0.12)", borderColor: "rgba(16,185,129,0.3)", title: "Volume Confirms Strength", desc: "Rising prices with higher volume shows strong buying interest." },
    { icon: "🎯", bg: "rgba(245,158,11,0.12)", borderColor: "rgba(245,158,11,0.3)", title: "Breakouts Hold Longer", desc: "Breakouts backed by volume are more reliable and sustainable." },
    { icon: "🏦", bg: "rgba(239,68,68,0.12)", borderColor: "rgba(239,68,68,0.3)", title: "Smart Money Participation", desc: "Institutions leave a footprint through volume expansion." },
  ],
  patternSteps: [
    { icon: "🔗", label: "Consolidation\n(Quiet)" },
    { icon: "📈", label: "Volume\nExpansion" },
    { icon: "🚀", label: "Breakout\nAbove Res." },
    { icon: "🔄", label: "Retest\nLevel" },
    { icon: "📉", label: "Trend\nCont." },
  ],
  tagline: "Volume is the fuel. Price is the result.",
};

const DEFAULT_RADAR = {
  brand: "CANDLEWISE",
  weekLabel: "Week of Jun 2026",
  ticker: "DIXON",
  sector: "Electronics",
  exchange: "NSE",
  timeframe: "Weekly",
  thesis: "Breaking out of an 8-month base with institutional volume. Classic spring-load setup.",
  subtitle: "This is a watchlist observation, not a recommendation.",
  hookVariant: "redacted", // "redacted" | "chart" | "stat"
  hookHeadline: "This stock just broke an 8-month base on 3x volume. Can you guess it?",
  hookStat: { value: "3.2x", label: "weekly volume vs average" },
  clues: [
    { icon: "🏭", text: "Sector: Electronics manufacturing — riding the PLI tailwind." },
    { icon: "💰", text: "Mid-cap, comfortably under ₹20,000 Cr." },
    { icon: "📈", text: "Just broke out of an 8-month base on the weekly chart." },
  ],
  zone: "ACTIVE BREAKOUT",
  zoneColor: "#10b981",
  setupPoints: [
    { title: "Breaking out of 8-month base", desc: "Price coiling in a tight range with declining volume — classic spring-load pattern." },
    { title: "Volume surge on weekly candle", desc: "Last week's volume was 3.2x average. Institutions are clearly accumulating." },
    { title: "Sector tailwind — Electronics PLI", desc: "Government push for domestic manufacturing adds fundamental support." },
  ],
  riskNote: "Allocate only what you can afford to lose. This is a watchlist, not advice.",
};

const DEFAULT_REVIEW = {
  brand: "CANDLEWISE",
  ticker: "ASHOKLEY", period: "Feb–Apr 2026",
  titleLine1: "TRADE", titleLine2: "RECAP —", titleHighlight: "62% GAIN",
  subtitle: "Here's exactly how the volume breakout trade played out from entry to exit.",
  outcome: "WIN", returnPct: "+62.4%",
  entryPrice: "₹88.00", exitPrice: "₹145.29", holdDays: "68d",
  learnings: [
    { icon: "✅", title: "Volume confirmed the breakout", desc: "Entry was justified — volume on breakout day was 4x average." },
    { icon: "📐", title: "Patience at the retest", desc: "Price came back to test the breakout zone. Holding through was the right call." },
    { icon: "⚠️", title: "Exited too early at first target", desc: "Left 20% on the table. Need to let winners run with a trailing stop." },
  ],
  quote: "Your best trades will always feel uncomfortable to hold. Trust the process.",
};

const DEFAULT_BREAKDOWN = {
  brand: "CANDLEWISE",
  ticker: "NIFTY 50",
  timeframe: "Weekly",
  // Use \n to split the hook into two lines
  hookQuestion: "Can you spot the pattern\\nforming here?",
  hookDesc: "This is a historical chart pattern. Study the structure before swiping to the reveal.",
  patternName: "Cup & Handle",
  avgMove: "+22%",
  annotations: [
    { label: "Cup base",    top: 55, left: 5,  color: "violet" },
    { label: "Handle",      top: 18, right: 8, color: "gold"   },
    { label: "Breakout →",  bottom: 8, right: 5, color: "green" },
  ],
  entryTrigger: "Close above rim with 2× avg volume",
  stop: "Below handle low",
  target: "Depth of cup projected up",
  rules: [
    { title: "Volume dries up in the handle", desc: "Low volume during handle formation = healthy consolidation." },
    { title: "Breakout must have conviction", desc: "Volume on breakout day should be at least 1.5× the 20-day average." },
    { title: "Don't chase breakouts", desc: "Wait for the daily close, not an intraday push above the rim." },
  ],
  quote: "Patterns don't predict the future. They shift the probability in your favour.",
};

const DEFAULT_CONCEPT = {
  brand: "CANDLEWISE",
  conceptName: "Death Cross",
  definition: "When the 50-day moving average crosses below the 200-day moving average — signalling a potential long-term downtrend.",
  analogy: "Think of it like a slow-moving storm cloud overtaking the sun. The short-term trend has cooled enough to pull the long-term trend downward with it.",
  keyPoints: [
    "50 DMA crossing below 200 DMA confirms bearish momentum shift.",
    "Best used on daily or weekly charts — noisy on shorter timeframes.",
    "Often followed by a relief rally — the real test is the next lower high.",
    "Opposite of the Golden Cross, which is a bullish signal.",
  ],
  exampleEmoji: "📉",
  example: "Nifty 50 formed a Death Cross in Mar 2020. Fell ~38% before reversing.",
};

const DEFAULT_MARKET_VIEWS = {
  brand: "CANDLEWISE",
  statement: "WHY I DON'T\nUSE RSI",
  statementSub: "An indicator followed by millions — yet I removed it from every chart.",
  commonBelief: "RSI tells you when a stock is overbought or oversold. Buy below 30. Sell above 70.",
  beliefTags: [],
  tensionTeaser: "I used to trade this way. My results told a different story.",
  viewPoints: [
    "I focus on price action first.",
    "RSI is secondary.",
    "Context matters more than any indicator.",
  ],
  contextNote: "A stock can stay 'overbought' for months during a strong uptrend. The indicator lags. Price doesn't lie.",
  question: "RSI or Price Action?\nWhat's worked better for you?",
  sideA: { emoji: "📊", label: "RSI — I trust the indicator" },
  sideB: { emoji: "📈", label: "Price Action — charts first" },
  closingQuote: "Indicators are derived from price. So why not read price directly?",
};

const DEFAULT_RADAR_REEL = {
  brand: "CANDLEWISE",
  title: "3 Stocks On My\nRadar This Week",
  subheadline: "Swipe to see which stocks are on the list",
  weekLabel: "WEEK OF JUN 14",
  stock1Ticker: "POLYCAB",
  stock1Company: "Polycab India Ltd",
  stock1Clue1: "Breaking out of a 6-month consolidation range",
  stock1Clue2: "Volume spiked 2.5x the 20-day average",
  stock1Clue3: "Sector leader showing renewed momentum",
  stock2Ticker: "TATAPOWER",
  stock2Company: "Tata Power Company Ltd",
  stock2Clue1: "Forming a tight flag pattern near resistance",
  stock2Clue2: "Sector showing relative strength vs Nifty",
  stock2Clue3: "Strong volume support on recent pullbacks",
  stock3Ticker: "DIXON",
  stock3Company: "Dixon Technologies Ltd",
  stock3Clue1: "Retesting a former resistance turned support",
  stock3Clue2: "RSI cooling off from overbought into neutral",
  stock3Clue3: "Holding above key moving averages",
  ctaText: "Check the latest carousel posts",
};

/* ═══════════════════════════════════════════════════════════
   EDITOR HELPERS
═══════════════════════════════════════════════════════════ */
function Field({ label, value, onChange, multiline }) {
  const s = {
    width: "100%", background: "#151a22", border: `1px solid #1e2530`,
    borderRadius: 8, color: "#ffffff", padding: "8px 10px",
    fontSize: 12, outline: "none", fontFamily: "'Montserrat', sans-serif",
    resize: multiline ? "vertical" : undefined, boxSizing: "border-box",
  };
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 10, color: "#6b7a90", marginBottom: 4, fontWeight: 700, letterSpacing: 0.5 }}>{label}</div>
      {multiline
        ? <textarea style={{ ...s, minHeight: 52 }} value={value} onChange={e => onChange(e.target.value)} />
        : <input style={s} value={value} onChange={e => onChange(e.target.value)} />
      }
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  const s = {
    width: "100%", background: "#151a22", border: `1px solid #1e2530`,
    borderRadius: 8, color: "#ffffff", padding: "8px 10px",
    fontSize: 12, outline: "none", fontFamily: "'Montserrat', sans-serif",
    boxSizing: "border-box",
  };
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 10, color: "#6b7a90", marginBottom: 4, fontWeight: 700, letterSpacing: 0.5 }}>{label}</div>
      <select style={s} value={value} onChange={e => onChange(e.target.value)}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function SectionHead({ title, color = "#3b82f6" }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 800, color, letterSpacing: 1.5, textTransform: "uppercase", borderBottom: "1px solid #1e2530", paddingBottom: 7, marginBottom: 12, marginTop: 6 }}>
      {title}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DOWNLOAD ENGINE
═══════════════════════════════════════════════════════════ */
const EXPORT_SIZE = 1080;
const SCALE = EXPORT_SIZE / SW;

async function captureSlideNode(node) {
  if (!window.html2canvas) throw new Error("html2canvas not loaded yet");
  return window.html2canvas(node, {
    scale: SCALE, useCORS: true, allowTaint: true,
    backgroundColor: null, width: SW, height: SH, logging: false,
  });
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

async function canvasToBlob(canvas) {
  return new Promise(resolve => canvas.toBlob(resolve, "image/png"));
}

function DownloadButton({ slides, template, accent }) {
  const [status, setStatus] = useState("idle");
  const [progress, setProgress] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!window.JSZip) {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
      document.head.appendChild(s);
    }
  }, []);

  const handleDownload = useCallback(async () => {
    if (!window.html2canvas) { alert("Renderer still loading — wait a second and try again."); return; }
    setStatus("loading"); setProgress(0);
    try {
      const nodes = Array.from(containerRef.current.querySelectorAll("[data-slide]"));
      const prefix = template.toUpperCase();
      const blobs = [];
      for (let i = 0; i < nodes.length; i++) {
        const canvas = await captureSlideNode(nodes[i]);
        blobs.push({ blob: await canvasToBlob(canvas), name: `${prefix}_slide_${i + 1}.png` });
        setProgress(Math.round(((i + 1) / nodes.length) * 100));
      }
      if (window.JSZip) {
        const zip = new window.JSZip();
        blobs.forEach(({ blob, name }) => zip.file(name, blob));
        downloadBlob(await zip.generateAsync({ type: "blob" }), `CandleWise_${prefix}_carousel.zip`);
      } else {
        for (const { blob, name } of blobs) { downloadBlob(blob, name); await new Promise(r => setTimeout(r, 300)); }
      }
      setStatus("done"); setTimeout(() => setStatus("idle"), 3000);
    } catch (err) { console.error(err); setStatus("error"); setTimeout(() => setStatus("idle"), 3000); }
  }, [slides, template]);

  const btnLabel = status === "loading" ? `Exporting… ${progress}%` : status === "done" ? "✅ Downloaded!" : status === "error" ? "❌ Error — retry" : "⬇ Download All Slides";

  return (
    <>
      <div ref={containerRef} style={{ position: "fixed", top: 0, left: "-9999px", display: "flex", flexDirection: "column", pointerEvents: "none", zIndex: -1 }}>
        {slides.map((slide, i) => (
          <div key={i} data-slide={i} style={{ width: SW, height: SH, flexShrink: 0 }}>{slide}</div>
        ))}
      </div>
      <button onClick={handleDownload} disabled={status === "loading"} style={{
        display: "flex", alignItems: "center", gap: 8,
        background: status === "done" ? "#10b981" : status === "error" ? T.red : accent,
        border: "none", color: T.white, borderRadius: 10, padding: "11px 20px",
        fontWeight: 800, fontSize: 12, cursor: status === "loading" ? "not-allowed" : "pointer",
        fontFamily: T.font, opacity: status === "loading" ? 0.8 : 1, transition: "all 0.2s",
        minWidth: 200, justifyContent: "center",
      }}>
        {status === "idle" && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>}
        {btnLabel}
      </button>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </>
  );
}

/* ─────────────────────────────────────────────
   RADAR REEL EXPORT ENGINE — separate 1080x1920 pipeline.
   Carousel export above (DownloadButton/captureSlideNode) is untouched.
───────────────────────────────────────────── */
const REEL_SCALE = 1; // reel components are already authored at full 1080x1920

async function captureReelNode(node) {
  if (!window.html2canvas) throw new Error("html2canvas not loaded yet");
  return window.html2canvas(node, {
    scale: REEL_SCALE, useCORS: true, allowTaint: true,
    backgroundColor: "#09090f", width: REEL_W, height: REEL_H, logging: false,
  });
}

function ReelDownloadButton({ slides, accent, activeSlide }) {
  const [status, setStatus] = useState("idle");
  const [progress, setProgress] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!window.JSZip) {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
      document.head.appendChild(s);
    }
  }, []);

  const exportScenes = useCallback(async (indices, opts = {}) => {
    if (!window.html2canvas) { alert("Renderer still loading — wait a second and try again."); return; }
    setStatus("loading"); setProgress(0);
    try {
      const nodes = Array.from(containerRef.current.querySelectorAll("[data-reel-slide]"));
      const blobs = [];
      for (let i = 0; i < indices.length; i++) {
        const idx = indices[i];
        const canvas = await captureReelNode(nodes[idx]);
        blobs.push({ blob: await canvasToBlob(canvas), name: `radar-reel-scene-${idx + 1}.png` });
        setProgress(Math.round(((i + 1) / indices.length) * 100));
      }
      if (opts.zip && window.JSZip) {
        const zip = new window.JSZip();
        blobs.forEach(({ blob, name }) => zip.file(name, blob));
        downloadBlob(await zip.generateAsync({ type: "blob" }), `CandleWise_RadarReel.zip`);
      } else {
        for (const { blob, name } of blobs) { downloadBlob(blob, name); await new Promise(r => setTimeout(r, 300)); }
      }
      setStatus("done"); setTimeout(() => setStatus("idle"), 3000);
    } catch (err) { console.error(err); setStatus("error"); setTimeout(() => setStatus("idle"), 3000); }
  }, [slides]);

  const allIndices = slides.map((_, i) => i);
  const isLoading = status === "loading";
  const btnLabel = isLoading ? `Exporting… ${progress}%` : status === "done" ? "✅ Done!" : status === "error" ? "❌ Error — retry" : null;

  const btnBase = {
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    border: "none", color: T.white, borderRadius: 10, padding: "11px 18px",
    fontWeight: 800, fontSize: 12, cursor: isLoading ? "not-allowed" : "pointer",
    fontFamily: T.font, opacity: isLoading ? 0.8 : 1, transition: "all 0.2s",
  };
  const statusColor = status === "done" ? "#10b981" : status === "error" ? T.red : accent;

  return (
    <>
      {/* Hidden full-resolution 1080x1920 render targets for capture */}
      <div ref={containerRef} style={{ position: "fixed", top: 0, left: "-99999px", display: "flex", flexDirection: "column", pointerEvents: "none", zIndex: -1 }}>
        {slides.map((slide, i) => (
          <div key={i} data-reel-slide={i} style={{ width: REEL_W, height: REEL_H, flexShrink: 0 }}>{slide}</div>
        ))}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        <button onClick={() => exportScenes(allIndices, { zip: true })} disabled={isLoading} style={{ ...btnBase, background: statusColor, minWidth: 200 }}>
          {!btnLabel && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>}
          {btnLabel || "⬇ Export All Scenes (ZIP)"}
        </button>
        <button onClick={() => exportScenes(allIndices, { zip: false })} disabled={isLoading} style={{ ...btnBase, background: T.surface, border: `1px solid ${accent}55`, color: accent, minWidth: 170 }}>
          ⬇ Export All Scenes (PNGs)
        </button>
        <button onClick={() => exportScenes([activeSlide], { zip: false })} disabled={isLoading} style={{ ...btnBase, background: T.surface, border: `1px solid ${T.border}`, color: T.mutedLight, minWidth: 170 }}>
          ⬇ Export Current Scene
        </button>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════════ */
const TEMPLATES = [
  { id: "edu",         label: "📚 Education",     accent: "#3b82f6" },
  { id: "radar",       label: "📡 Radar",          accent: "#f59e0b" },
  { id: "review",      label: "📋 Review",         accent: "#10b981" },
  { id: "breakdown",   label: "🔍 Breakdown",      accent: "#8b5cf6" },
  { id: "concept",     label: "💡 Concept",        accent: "#06b6d4" },
  { id: "marketviews", label: "🔥 Market Views",   accent: "#ef4444" },
  { id: "radarreel",   label: "📡 Radar Reel",     accent: "#f59e0b" },
];

export default function App() {
  const [template, setTemplate]       = useState("edu");
  const [tab, setTab]                 = useState("preview");
  const [activeSlide, setActiveSlide] = useState(0);
  const [chartImg, setChartImg]       = useState(null);
  const [chart2Img, setChart2Img]     = useState(null);
  const [eduData, setEduData]         = useState(DEFAULT_EDU);
  const [radarData, setRadarData]     = useState(DEFAULT_RADAR);
  const [reviewData, setReviewData]   = useState(DEFAULT_REVIEW);
  const [bdData, setBdData]           = useState(DEFAULT_BREAKDOWN);
  const [ccData, setCcData]           = useState(DEFAULT_CONCEPT);
  const [mvData, setMvData]           = useState(DEFAULT_MARKET_VIEWS);
  const [radarReelData, setRadarReelData] = useState(DEFAULT_RADAR_REEL);
  const fileRef  = useRef();
  const file2Ref = useRef();

  const handleChartUpload = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setChartImg(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleChart2Upload = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setChart2Img(ev.target.result);
    reader.readAsDataURL(file);
  };

  const currentAccent = TEMPLATES.find(t => t.id === template)?.accent || "#3b82f6";

  const getSlides = () => {
    if (template === "edu") return [
      <EduSlide1 d={eduData} />,
      <EduSlide2 d={eduData} chartImg={chartImg} />,
      <EduSlide3 d={eduData} />,
      <EduSlide4 d={eduData} />,
      <DisclaimerSlide brand={eduData.brand} accent="#3b82f6" />,
    ];
    if (template === "radar") return [
      <RadarSlide1 d={radarData} />,
      <RadarSlide2 d={radarData} />,
      <RadarSlide3 d={radarData} chartImg={chartImg} />,
      <RadarSlide4 d={radarData} />,
      <DisclaimerSlide brand={radarData.brand} accent="#f59e0b" />,
    ];
    if (template === "review") return [
      <ReviewSlide1 d={reviewData} />,
      <ReviewSlide2 d={reviewData} chartImg={chartImg} />,
      <ReviewSlide3 d={reviewData} />,
      <DisclaimerSlide brand={reviewData.brand} accent="#10b981" />,
    ];
    if (template === "breakdown") return [
      <BdSlide1 d={bdData} chartImg={chartImg} />,
      <BdSlide2 d={bdData} chart2Img={chart2Img} />,
      <BdSlide3 d={bdData} />,
    ];
    if (template === "marketviews") return [
      <MvSlide1 d={mvData} />,
      <MvSlide2 d={mvData} />,
      <MvSlide3 d={mvData} />,
      <MvSlide4 d={mvData} />,
    ];
    if (template === "radarreel") return [
      <RadarReelSlide1 d={radarReelData} />,
      <RadarReelSlide2 d={radarReelData} />,
      <RadarReelSlide3 d={radarReelData} />,
      <RadarReelSlide4 d={radarReelData} />,
      <RadarReelSlide5 d={radarReelData} />,
    ];
    // concept
    return [
      <CcSlide1 d={ccData} />,
      <CcSlide2 d={ccData} />,
    ];
  };

  const slides     = getSlides();
  const safeActive = Math.min(activeSlide, slides.length - 1);

  const updEdu    = (k, v) => setEduData(d    => ({ ...d, [k]: v }));
  const updRadar  = (k, v) => setRadarData(d  => ({ ...d, [k]: v }));
  const updReview = (k, v) => setReviewData(d => ({ ...d, [k]: v }));
  const updBd     = (k, v) => setBdData(d     => ({ ...d, [k]: v }));
  const updCc     = (k, v) => setCcData(d     => ({ ...d, [k]: v }));
  const updMv     = (k, v) => setMvData(d     => ({ ...d, [k]: v }));
  const updRadarReel = (k, v) => setRadarReelData(d => ({ ...d, [k]: v }));

  const updEduWhy      = (i, f, v) => { const a = [...eduData.whyPoints];      a[i] = { ...a[i], [f]: v }; updEdu("whyPoints", a); };
  const updEduStep     = (i, f, v) => { const a = [...eduData.patternSteps];    a[i] = { ...a[i], [f]: v }; updEdu("patternSteps", a); };
  const updRadarSetup  = (i, f, v) => { const a = [...radarData.setupPoints];   a[i] = { ...a[i], [f]: v }; updRadar("setupPoints", a); };
  const updRadarClue   = (i, f, v) => { const a = [...(radarData.clues || [])]; a[i] = { ...a[i], [f]: v }; updRadar("clues", a); };
  const updRadarHookStat = (f, v) => { updRadar("hookStat", { ...(radarData.hookStat || {}), [f]: v }); };
  const updReviewLearn = (i, f, v) => { const a = [...reviewData.learnings];    a[i] = { ...a[i], [f]: v }; updReview("learnings", a); };
  const updBdRule      = (i, f, v) => { const a = [...bdData.rules];            a[i] = { ...a[i], [f]: v }; updBd("rules", a); };
  const updCcPoint     = (i, v)    => { const a = [...ccData.keyPoints];        a[i] = v;                   updCc("keyPoints", a); };
  const updMvViewPoint = (i, v)    => { const a = [...mvData.viewPoints];       a[i] = v;                   updMv("viewPoints", a); };
  const updMvBeliefTag = (i, v)    => { const a = [...(mvData.beliefTags||[])]; a[i] = v;                   updMv("beliefTags", a); };
  const updMvSideA     = (f, v)    => { updMv("sideA", { ...(mvData.sideA||{}), [f]: v }); };
  const updMvSideB     = (f, v)    => { updMv("sideB", { ...(mvData.sideB||{}), [f]: v }); };

  const slideLabels = (count) => {
    const noDisclaimer = ["breakdown", "concept", "marketviews", "radarreel"];
    if (template === "radarreel") {
      const reelLabels = ["Hook", "Stock 1", "Stock 2", "Stock 3", "CTA"];
      return Array.from({ length: count }, (_, i) => `Scene ${i + 1} — ${reelLabels[i] || ""}`.trim());
    }
    return Array.from({ length: count }, (_, i) =>
      (!noDisclaimer.includes(template) && i === count - 1) ? "⚖️ Disclaimer" : `Slide ${i + 1}`
    );
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.white, fontFamily: T.font }}>
      <FontLoader />

      {/* ── Header ── */}
      <div style={{ background: T.card, borderBottom: `1px solid ${T.border}`, padding: "0 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 14, paddingBottom: 10 }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: 15, letterSpacing: -0.3 }}>
              <span style={{ color: currentAccent }}>▲</span> Carousel Studio
            </div>
            <div style={{ color: T.muted, fontSize: 10, fontWeight: 600, letterSpacing: 0.5, marginTop: 2 }}>CANDLEWISE — Content Engine</div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {["preview", "edit"].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                background: tab === t ? currentAccent : "transparent",
                border: `1px solid ${tab === t ? currentAccent : T.border}`,
                color: tab === t ? T.white : T.muted,
                borderRadius: 8, padding: "6px 14px", cursor: "pointer",
                fontSize: 11, fontWeight: 700, fontFamily: T.font,
              }}>
                {t === "preview" ? "👁 Preview" : "✏️ Edit"}
              </button>
            ))}
          </div>
        </div>
        {/* Template switcher — scrollable row */}
        <div style={{ display: "flex", gap: 7, paddingBottom: 14, overflowX: "auto" }}>
          {TEMPLATES.map(tmpl => (
            <button key={tmpl.id} onClick={() => { setTemplate(tmpl.id); setActiveSlide(0); }} style={{
              background: template === tmpl.id ? `${tmpl.accent}18` : "transparent",
              border: `1px solid ${template === tmpl.id ? tmpl.accent : T.border}`,
              color: template === tmpl.id ? tmpl.accent : T.muted,
              borderRadius: 20, padding: "5px 14px", cursor: "pointer",
              fontSize: 11, fontWeight: 700, fontFamily: T.font,
              transition: "all 0.15s", flexShrink: 0,
            }}>
              {tmpl.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Preview Tab ── */}
      {tab === "preview" && (
        <div style={{ padding: "20px 20px 40px" }}>
          <div style={{ display: "flex", gap: 7, marginBottom: 18, flexWrap: "wrap" }}>
            {slideLabels(slides.length).map((label, i) => (
              <button key={i} onClick={() => setActiveSlide(i)} style={{
                background: safeActive === i ? currentAccent : T.surface,
                border: `1px solid ${safeActive === i ? currentAccent : T.border}`,
                color: safeActive === i ? T.white : T.muted,
                borderRadius: 8, padding: "5px 13px", cursor: "pointer",
                fontSize: 11, fontWeight: 700, fontFamily: T.font,
              }}>{label}</button>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            {template === "radarreel"
              ? (
                <div style={{ width: RW, height: RH, overflow: "hidden", borderRadius: 18, border: `1px solid ${T.border}` }}>
                  <div style={{ transform: `scale(${REEL_PREVIEW_SCALE})`, transformOrigin: "top left", width: REEL_W, height: REEL_H }}>
                    {slides[safeActive]}
                  </div>
                </div>
              )
              : slides[safeActive]
            }
          </div>

          {/* Thumbnail strip */}
          <div style={{ marginTop: 24 }}>
            <div style={{ fontSize: 10, color: T.muted, fontWeight: 700, letterSpacing: 1.5, marginBottom: 10, textTransform: "uppercase" }}>All Slides — click to select</div>
            <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8 }}>
              {slides.map((s, i) => (
                template === "radarreel" ? (
                  <div key={i} onClick={() => setActiveSlide(i)} style={{
                    width: RW * 0.4, height: RH * 0.4, flexShrink: 0, cursor: "pointer",
                    borderRadius: 6, overflow: "hidden",
                    outline: safeActive === i ? `2.5px solid ${currentAccent}` : `1px solid ${T.border}`,
                    position: "relative",
                  }}>
                    <div style={{ transform: `scale(${REEL_PREVIEW_SCALE * 0.4})`, transformOrigin: "top left", width: REEL_W, height: REEL_H, pointerEvents: "none" }}>{s}</div>
                  </div>
                ) : (
                  <div key={i} onClick={() => setActiveSlide(i)} style={{
                    width: SW * 0.27, height: SH * 0.27, flexShrink: 0, cursor: "pointer",
                    borderRadius: 6, overflow: "hidden",
                    outline: safeActive === i ? `2.5px solid ${currentAccent}` : `1px solid ${T.border}`,
                    position: "relative",
                  }}>
                    <div style={{ transform: `scale(0.27)`, transformOrigin: "top left", width: SW, height: SH, pointerEvents: "none" }}>{s}</div>
                  </div>
                )
              ))}
            </div>
          </div>

          {/* Download panel */}
          <div style={{ marginTop: 28, background: T.surface, border: `1px solid ${currentAccent}33`, borderRadius: 14, padding: "20px 22px" }}>
            {template === "radarreel" ? (
              <>
                <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 6, color: currentAccent }}>🎬 Export Radar Reel</div>
                <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.6, marginBottom: 16, fontWeight: 500 }}>
                  Exports {slides.length} vertical scenes as <strong style={{ color: T.white }}>1080×1920 px PNG</strong> files (9:16), named <code style={{ color: T.white, background: T.bg, border: `1px solid ${T.border}`, borderRadius: 4, padding: "1px 5px", fontSize: 10.5 }}>radar-reel-scene-1.png</code> … <code style={{ color: T.white, background: T.bg, border: `1px solid ${T.border}`, borderRadius: 4, padding: "1px 5px", fontSize: 10.5 }}>radar-reel-scene-5.png</code>. Independent from the carousel export.
                </div>
                <ReelDownloadButton slides={slides} accent={currentAccent} activeSlide={safeActive} />
              </>
            ) : (
              <>
                <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 6, color: currentAccent }}>📲 Export for Instagram</div>
                <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.6, marginBottom: 16, fontWeight: 500 }}>
                  Exports all {slides.length} slides as <strong style={{ color: T.white }}>1080×1080 px PNG</strong> files ready for an Instagram carousel. Downloads as a ZIP.
                </div>
                <DownloadButton slides={slides} template={template} accent={currentAccent} />
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Edit Tab ── */}
      {tab === "edit" && (
        <div style={{ padding: "20px", maxWidth: 560, margin: "0 auto" }}>

          {/* Chart upload — shown for templates that use a chart */}
          {["edu","radar","review"].includes(template) && (
            <div style={{ background: T.surface, border: `2px dashed ${T.borderLight}`, borderRadius: 14, padding: 18, marginBottom: 20, textAlign: "center" }}>
              <div style={{ fontWeight: 800, fontSize: 12, marginBottom: 10, color: currentAccent }}>📈 Chart Screenshot</div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleChartUpload} style={{ display: "none" }} />
              <button onClick={() => fileRef.current.click()} style={{ background: currentAccent, border: "none", color: T.white, borderRadius: 8, padding: "8px 18px", cursor: "pointer", fontWeight: 700, fontSize: 12, fontFamily: T.font }}>
                {chartImg ? "🔄 Replace Chart" : "📂 Upload Chart"}
              </button>
              {chartImg && <img src={chartImg} alt="preview" style={{ marginTop: 12, maxHeight: 90, borderRadius: 8, display: "block", margin: "12px auto 0", maxWidth: "100%", objectFit: "contain" }} />}
            </div>
          )}

          {/* Breakdown: two separate chart uploads */}
          {template === "breakdown" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
              <div style={{ background: T.surface, border: `2px dashed ${T.borderLight}`, borderRadius: 14, padding: 16, textAlign: "center" }}>
                <div style={{ fontWeight: 800, fontSize: 12, marginBottom: 8, color: currentAccent }}>🔍 Slide 1 — Sample Pattern Chart</div>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleChartUpload} style={{ display: "none" }} />
                <button onClick={() => fileRef.current.click()} style={{ background: currentAccent, border: "none", color: T.white, borderRadius: 8, padding: "7px 16px", cursor: "pointer", fontWeight: 700, fontSize: 11, fontFamily: T.font }}>
                  {chartImg ? "🔄 Replace" : "📂 Upload"}
                </button>
                {chartImg && <img src={chartImg} alt="preview" style={{ marginTop: 10, maxHeight: 80, borderRadius: 8, display: "block", margin: "10px auto 0", maxWidth: "100%", objectFit: "contain" }} />}
              </div>
              <div style={{ background: T.surface, border: `2px dashed ${T.borderLight}`, borderRadius: 14, padding: 16, textAlign: "center" }}>
                <div style={{ fontWeight: 800, fontSize: 12, marginBottom: 8, color: currentAccent }}>📈 Slide 2 — Real Ticker Chart</div>
                <input ref={file2Ref} type="file" accept="image/*" onChange={handleChart2Upload} style={{ display: "none" }} />
                <button onClick={() => file2Ref.current.click()} style={{ background: currentAccent, border: "none", color: T.white, borderRadius: 8, padding: "7px 16px", cursor: "pointer", fontWeight: 700, fontSize: 11, fontFamily: T.font }}>
                  {chart2Img ? "🔄 Replace" : "📂 Upload"}
                </button>
                {chart2Img && <img src={chart2Img} alt="preview" style={{ marginTop: 10, maxHeight: 80, borderRadius: 8, display: "block", margin: "10px auto 0", maxWidth: "100%", objectFit: "contain" }} />}
              </div>
            </div>
          )}

          {/* ── EDU fields ── */}
          {template === "edu" && (
            <>
              <SectionHead title="Cover" color="#3b82f6" />
              <Field label="Title Line 1"   value={eduData.titleLine1}     onChange={v => updEdu("titleLine1", v)} />
              <Field label="Title Line 2"   value={eduData.titleLine2}     onChange={v => updEdu("titleLine2", v)} />
              <Field label="Highlight Word" value={eduData.titleHighlight} onChange={v => updEdu("titleHighlight", v)} />
              <Field label="Subtitle"       value={eduData.subtitle}       onChange={v => updEdu("subtitle", v)} multiline />
              <SectionHead title="Chart Annotations" color="#3b82f6" />
              <Field label="Top Label"    value={eduData.chartTopLabel}    onChange={v => updEdu("chartTopLabel", v)} />
              <Field label="Bottom Label" value={eduData.chartBottomLabel} onChange={v => updEdu("chartBottomLabel", v)} />
              <Field label="Chart Caption / Description" value={eduData.chartCaption || ""} onChange={v => updEdu("chartCaption", v)} multiline />
              <SectionHead title="Why This Matters" color="#3b82f6" />
              {eduData.whyPoints.map((p, i) => (
                <div key={i} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: 12, marginBottom: 10 }}>
                  <div style={{ fontSize: 10, color: "#3b82f6", fontWeight: 800, marginBottom: 8 }}>Point {i + 1}</div>
                  <Field label="Icon" value={p.icon} onChange={v => updEduWhy(i, "icon", v)} />
                  <Field label="Title" value={p.title} onChange={v => updEduWhy(i, "title", v)} />
                  <Field label="Description" value={p.desc} onChange={v => updEduWhy(i, "desc", v)} multiline />
                </div>
              ))}
              <SectionHead title="Pattern Steps" color="#3b82f6" />
              {eduData.patternSteps.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 72 }}><Field label={`S${i+1} icon`} value={s.icon} onChange={v => updEduStep(i, "icon", v)} /></div>
                  <div style={{ flex: 1 }}><Field label="Label" value={s.label} onChange={v => updEduStep(i, "label", v)} multiline /></div>
                </div>
              ))}
              <Field label="Tagline" value={eduData.tagline} onChange={v => updEdu("tagline", v)} multiline />
              <SectionHead title="Brand" color="#3b82f6" />
              <Field label="Brand Name" value={eduData.brand} onChange={v => updEdu("brand", v)} />
            </>
          )}

          {/* ── RADAR fields ── */}
          {template === "radar" && (
            <>
              <SectionHead title="Cover (Slide 1 — Hook)" color="#f59e0b" />
              <Field label="Ticker (kept secret until Slide 3)" value={radarData.ticker} onChange={v => updRadar("ticker", v)} />
              <Field label="Exchange"    value={radarData.exchange || ""} onChange={v => updRadar("exchange", v)} />
              <Field label="Timeframe"   value={radarData.timeframe || ""} onChange={v => updRadar("timeframe", v)} />
              <SelectField
                label="Hook Style (vary this across posts)"
                value={radarData.hookVariant || "redacted"}
                onChange={v => updRadar("hookVariant", v)}
                options={[
                  { value: "redacted", label: "Redacted ticker tiles (?????)" },
                  { value: "chart",    label: "Mystery price-action bars" },
                  { value: "stat",     label: "Big teaser stat" },
                ]}
              />
              {radarData.hookVariant === "stat" && (
                <div style={{ display: "flex", gap: 8 }}>
                  <div style={{ flex: 1 }}><Field label="Stat Value (e.g. 3.2x)" value={radarData.hookStat?.value || ""} onChange={v => updRadarHookStat("value", v)} /></div>
                  <div style={{ flex: 2 }}><Field label="Stat Label" value={radarData.hookStat?.label || ""} onChange={v => updRadarHookStat("label", v)} /></div>
                </div>
              )}
              <Field label="Hook Headline (the curiosity hook / question)" value={radarData.hookHeadline || ""} onChange={v => updRadar("hookHeadline", v)} multiline />
              <Field label="Subtitle"    value={radarData.subtitle}   onChange={v => updRadar("subtitle", v)} multiline />
              <SectionHead title="Clues (Slide 2 — don't reveal the name!)" color="#f59e0b" />
              {(radarData.clues || []).map((c, i) => (
                <div key={i} style={{ display: "flex", gap: 6 }}>
                  <div style={{ width: 56 }}><Field label="Icon" value={c.icon} onChange={v => updRadarClue(i, "icon", v)} /></div>
                  <div style={{ flex: 1 }}><Field label="Hint text" value={c.text} onChange={v => updRadarClue(i, "text", v)} multiline /></div>
                </div>
              ))}
              <SectionHead title="Chart Slide (Slide 3)" color="#f59e0b" />
              <Field label="Zone Status (e.g. ACTIVE BREAKOUT, WAIT FOR PULLBACK)" value={radarData.zone || ""} onChange={v => updRadar("zone", v)} />
              <Field label="Zone Colour (hex)" value={radarData.zoneColor || "#10b981"} onChange={v => updRadar("zoneColor", v)} />
              <SectionHead title="Setup Points (Slide 4)" color="#f59e0b" />
              {radarData.setupPoints.map((p, i) => (
                <div key={i} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: 12, marginBottom: 10 }}>
                  <div style={{ fontSize: 10, color: "#f59e0b", fontWeight: 800, marginBottom: 8 }}>Point {i + 1}</div>
                  <Field label="Title" value={p.title} onChange={v => updRadarSetup(i, "title", v)} />
                  <Field label="Description" value={p.desc} onChange={v => updRadarSetup(i, "desc", v)} multiline />
                </div>
              ))}
              <Field label="Risk Note" value={radarData.riskNote} onChange={v => updRadar("riskNote", v)} multiline />
              <SectionHead title="Brand" color="#f59e0b" />
              <Field label="Brand Name" value={radarData.brand} onChange={v => updRadar("brand", v)} />
            </>
          )}

          {/* ── REVIEW fields ── */}
          {template === "review" && (
            <>
              <SectionHead title="Cover" color="#10b981" />
              <Field label="Ticker"               value={reviewData.ticker}         onChange={v => updReview("ticker", v)} />
              <Field label="Period"               value={reviewData.period}         onChange={v => updReview("period", v)} />
              <Field label="Title Line 1"         value={reviewData.titleLine1}     onChange={v => updReview("titleLine1", v)} />
              <Field label="Title Line 2"         value={reviewData.titleLine2}     onChange={v => updReview("titleLine2", v)} />
              <Field label="Highlight"            value={reviewData.titleHighlight} onChange={v => updReview("titleHighlight", v)} />
              <Field label="Outcome (WIN / LOSS)" value={reviewData.outcome}        onChange={v => updReview("outcome", v)} />
              <Field label="Return %"             value={reviewData.returnPct}      onChange={v => updReview("returnPct", v)} />
              <Field label="Subtitle"             value={reviewData.subtitle}       onChange={v => updReview("subtitle", v)} multiline />
              <SectionHead title="Trade Numbers" color="#10b981" />
              <Field label="Entry Price" value={reviewData.entryPrice} onChange={v => updReview("entryPrice", v)} />
              <Field label="Exit Price"  value={reviewData.exitPrice}  onChange={v => updReview("exitPrice", v)} />
              <Field label="Hold Days"   value={reviewData.holdDays}   onChange={v => updReview("holdDays", v)} />
              <SectionHead title="Key Learnings" color="#10b981" />
              {reviewData.learnings.map((l, i) => (
                <div key={i} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: 12, marginBottom: 10 }}>
                  <div style={{ fontSize: 10, color: "#10b981", fontWeight: 800, marginBottom: 8 }}>Learning {i + 1}</div>
                  <Field label="Icon" value={l.icon} onChange={v => updReviewLearn(i, "icon", v)} />
                  <Field label="Title" value={l.title} onChange={v => updReviewLearn(i, "title", v)} />
                  <Field label="Description" value={l.desc} onChange={v => updReviewLearn(i, "desc", v)} multiline />
                </div>
              ))}
              <Field label="Closing Quote" value={reviewData.quote} onChange={v => updReview("quote", v)} multiline />
              <SectionHead title="Brand" color="#10b981" />
              <Field label="Brand Name" value={reviewData.brand} onChange={v => updReview("brand", v)} />
            </>
          )}

          {/* ── BREAKDOWN fields ── */}
          {template === "breakdown" && (
            <>
              <SectionHead title="Slide 1 — Hook" color="#8b5cf6" />
              <Field label={`Hook Question (use \\n to split lines)`} value={bdData.hookQuestion} onChange={v => updBd("hookQuestion", v)} multiline />
              <Field label="Brief Description" value={bdData.hookDesc || ""} onChange={v => updBd("hookDesc", v)} multiline />

              <SectionHead title="Slide 2 — Real Example" color="#8b5cf6" />
              <Field label="Ticker"       value={bdData.ticker}      onChange={v => updBd("ticker", v)} />
              <Field label="Timeframe"    value={bdData.timeframe}   onChange={v => updBd("timeframe", v)} />
              <Field label="Pattern Name" value={bdData.patternName} onChange={v => updBd("patternName", v)} />

              <SectionHead title="Slide 3 — Playbook" color="#8b5cf6" />
              <Field label="Entry Trigger" value={bdData.entryTrigger} onChange={v => updBd("entryTrigger", v)} multiline />
              <Field label="Stop"          value={bdData.stop}         onChange={v => updBd("stop", v)} />
              <Field label="Target"        value={bdData.target}       onChange={v => updBd("target", v)} multiline />
              {bdData.rules.map((r, i) => (
                <div key={i} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: 12, marginBottom: 10 }}>
                  <div style={{ fontSize: 10, color: "#8b5cf6", fontWeight: 800, marginBottom: 8 }}>Rule {i + 1}</div>
                  <Field label="Title"       value={r.title} onChange={v => updBdRule(i, "title", v)} />
                  <Field label="Description" value={r.desc}  onChange={v => updBdRule(i, "desc", v)} multiline />
                </div>
              ))}
              <Field label="Quote" value={bdData.quote} onChange={v => updBd("quote", v)} multiline />
              <SectionHead title="Brand" color="#8b5cf6" />
              <Field label="Brand Name" value={bdData.brand} onChange={v => updBd("brand", v)} />
            </>
          )}

          {/* ── CONCEPT CARD fields ── */}
          {template === "concept" && (
            <>
              <SectionHead title="Concept Card" color="#06b6d4" />
              <Field label="Concept Name (last word gets accent colour)" value={ccData.conceptName} onChange={v => updCc("conceptName", v)} />
              <Field label="One-line Definition" value={ccData.definition}  onChange={v => updCc("definition", v)} multiline />
              <Field label="Analogy / Think of it like…" value={ccData.analogy} onChange={v => updCc("analogy", v)} multiline />
              <SectionHead title="Key Points" color="#06b6d4" />
              {ccData.keyPoints.map((pt, i) => (
                <Field key={i} label={`Point ${i + 1}`} value={pt} onChange={v => updCcPoint(i, v)} multiline />
              ))}
              <SectionHead title="Brand" color="#06b6d4" />
              <Field label="Brand Name" value={ccData.brand} onChange={v => updCc("brand", v)} />
            </>
          )}

          {/* ── MARKET VIEWS fields ── */}
          {template === "marketviews" && (
            <>
              <SectionHead title="Slide 1 — Statement (the scroll-stopper)" color="#ef4444" />
              <Field label={`Bold Statement (use \\n to split lines — last line gets accent)`} value={mvData.statement} onChange={v => updMv("statement", v)} multiline />
              <Field label="Subtext (optional — one punchy line)" value={mvData.statementSub || ""} onChange={v => updMv("statementSub", v)} multiline />

              <SectionHead title="Slide 2 — Common Belief (tension setup)" color="#ef4444" />
              <Field label="What most traders believe" value={mvData.commonBelief} onChange={v => updMv("commonBelief", v)} multiline />
              <Field label="Tension Teaser (the cliffhanger that pulls to Slide 3)" value={mvData.tensionTeaser || ""} onChange={v => updMv("tensionTeaser", v)} multiline />

              <SectionHead title="Slide 3 — Your View (conviction points)" color="#ef4444" />
              {(mvData.viewPoints || []).map((pt, i) => (
                <Field key={i} label={`Point ${i + 1}`} value={pt} onChange={v => updMvViewPoint(i, v)} multiline />
              ))}
              <Field label="Context Note (italic — the nuance beneath your view)" value={mvData.contextNote || ""} onChange={v => updMv("contextNote", v)} multiline />

              <SectionHead title="Slide 4 — Question (drive comments)" color="#ef4444" />
              <Field label={`Question (use \\n to split lines)`} value={mvData.question} onChange={v => updMv("question", v)} multiline />
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ flex: 1 }}><Field label="Side A emoji" value={mvData.sideA?.emoji || "🔴"} onChange={v => updMvSideA("emoji", v)} /></div>
                <div style={{ flex: 3 }}><Field label="Side A label" value={mvData.sideA?.label || "Agree"} onChange={v => updMvSideA("label", v)} /></div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ flex: 1 }}><Field label="Side B emoji" value={mvData.sideB?.emoji || "🟢"} onChange={v => updMvSideB("emoji", v)} /></div>
                <div style={{ flex: 3 }}><Field label="Side B label" value={mvData.sideB?.label || "Disagree"} onChange={v => updMvSideB("label", v)} /></div>
              </div>
              <Field label="Closing Quote (optional — shows beneath the two camps)" value={mvData.closingQuote || ""} onChange={v => updMv("closingQuote", v)} multiline />

              <SectionHead title="Brand" color="#ef4444" />
              <Field label="Brand Name" value={mvData.brand} onChange={v => updMv("brand", v)} />
            </>
          )}

          {/* ── RADAR REEL fields ── */}
          {template === "radarreel" && (
            <>
              <SectionHead title="Scene 1 — Hook" color="#f59e0b" />
              <Field label={`Headline (use \\n to split lines)`} value={radarReelData.title} onChange={v => updRadarReel("title", v)} multiline />
              <Field label="Sub-headline" value={radarReelData.subheadline || ""} onChange={v => updRadarReel("subheadline", v)} multiline />
              <Field label="Week Label (optional, e.g. WEEK OF JUN 14)" value={radarReelData.weekLabel || ""} onChange={v => updRadarReel("weekLabel", v)} />

              <SectionHead title="Scene 2 — Stock 1" color="#f59e0b" />
              <Field label="Ticker"        value={radarReelData.stock1Ticker}  onChange={v => updRadarReel("stock1Ticker", v)} />
              <Field label="Company Name (optional)" value={radarReelData.stock1Company || ""} onChange={v => updRadarReel("stock1Company", v)} />
              <Field label="Clue 1" value={radarReelData.stock1Clue1} onChange={v => updRadarReel("stock1Clue1", v)} multiline />
              <Field label="Clue 2" value={radarReelData.stock1Clue2} onChange={v => updRadarReel("stock1Clue2", v)} multiline />
              <Field label="Clue 3" value={radarReelData.stock1Clue3 || ""} onChange={v => updRadarReel("stock1Clue3", v)} multiline />

              <SectionHead title="Scene 3 — Stock 2" color="#f59e0b" />
              <Field label="Ticker"        value={radarReelData.stock2Ticker}  onChange={v => updRadarReel("stock2Ticker", v)} />
              <Field label="Company Name (optional)" value={radarReelData.stock2Company || ""} onChange={v => updRadarReel("stock2Company", v)} />
              <Field label="Clue 1" value={radarReelData.stock2Clue1} onChange={v => updRadarReel("stock2Clue1", v)} multiline />
              <Field label="Clue 2" value={radarReelData.stock2Clue2} onChange={v => updRadarReel("stock2Clue2", v)} multiline />
              <Field label="Clue 3" value={radarReelData.stock2Clue3 || ""} onChange={v => updRadarReel("stock2Clue3", v)} multiline />

              <SectionHead title="Scene 4 — Stock 3" color="#f59e0b" />
              <Field label="Ticker"        value={radarReelData.stock3Ticker}  onChange={v => updRadarReel("stock3Ticker", v)} />
              <Field label="Company Name (optional)" value={radarReelData.stock3Company || ""} onChange={v => updRadarReel("stock3Company", v)} />
              <Field label="Clue 1" value={radarReelData.stock3Clue1} onChange={v => updRadarReel("stock3Clue1", v)} multiline />
              <Field label="Clue 2" value={radarReelData.stock3Clue2} onChange={v => updRadarReel("stock3Clue2", v)} multiline />
              <Field label="Clue 3" value={radarReelData.stock3Clue3 || ""} onChange={v => updRadarReel("stock3Clue3", v)} multiline />

              <SectionHead title="Scene 5 — CTA" color="#f59e0b" />
              <Field label="CTA Card Text" value={radarReelData.ctaText} onChange={v => updRadarReel("ctaText", v)} multiline />

              <SectionHead title="Brand" color="#f59e0b" />
              <Field label="Brand Name" value={radarReelData.brand} onChange={v => updRadarReel("brand", v)} />
            </>
          )}

          <button onClick={() => setTab("preview")} style={{
            width: "100%", background: currentAccent, border: "none", color: T.white,
            borderRadius: 10, padding: "13px", fontWeight: 800, fontSize: 13,
            cursor: "pointer", fontFamily: T.font, marginTop: 8,
          }}>
            👁 Preview All Slides →
          </button>
        </div>
      )}
    </div>
  );
}