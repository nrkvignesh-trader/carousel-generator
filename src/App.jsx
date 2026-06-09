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
function RadarSlide1({ d }) {
  return (
    <div style={{ ...slideBase, padding: "22px 24px 52px", background: "#09090f" }}>
      <GridOverlay />
      <div style={{ position: "absolute", bottom: -60, left: -60, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.13) 0%, transparent 60%)", zIndex: 0 }} />
      <div style={{ position: "absolute", top: -30, right: -30, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 65%)", zIndex: 0 }} />
      <CornerMark color={T.gold} />
      <SlideNum n={1} color={T.muted} />

      <div style={{ position: "relative", zIndex: 2, textAlign: "left" }}>
        <RadarBadge />

        <div style={{ marginTop: 18, fontSize: 10, fontWeight: 700, color: T.muted, letterSpacing: 2.5, textTransform: "uppercase" }}>{d.weekLabel}</div>

        {/* Big ticker — unique every post */}
        <div style={{ marginTop: 6, fontSize: 58, fontWeight: 900, letterSpacing: -2.5, lineHeight: 0.92, color: T.gold, textTransform: "uppercase" }}>
          {d.ticker}
        </div>

        {/* Sector / exchange / timeframe badges */}
        <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
          {d.sector && (
            <div style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 20, padding: "4px 12px", fontSize: 9.5, fontWeight: 800, color: T.gold, letterSpacing: 0.8 }}>{d.sector}</div>
          )}
          {d.exchange && (
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 20, padding: "4px 12px", fontSize: 9.5, fontWeight: 700, color: T.mutedLight }}>{d.exchange}</div>
          )}
          {d.timeframe && (
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 20, padding: "4px 12px", fontSize: 9.5, fontWeight: 700, color: T.mutedLight }}>{d.timeframe}</div>
          )}
        </div>

        {/* One-line thesis */}
        <div style={{ marginTop: 50, borderLeft: `3px solid ${T.gold}`, paddingLeft: 14 }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, color: T.white, lineHeight: 1.6 }}>{d.thesis}</div>
        </div>

        {/* Why I'm watching */}
        {/* {d.watchReason && (
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
            {d.watchReason.map((r, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "9px 12px" }}>
                <span style={{ fontSize: 15, flexShrink: 0 }}>{r.icon}</span>
                <div style={{ fontSize: 10.5, fontWeight: 600, color: T.mutedLight, lineHeight: 1.5 }}>{r.text}</div>
              </div>
            ))}
          </div>
        )} */}

        <div style={{ marginTop: 14, fontSize: 9.5, color: T.muted, fontWeight: 500, lineHeight: 1.5 }}>{d.subtitle}</div>
      </div>

      <Brand name={d.brand} color={T.muted} />
      <SaveForLater color={T.muted} />
    </div>
  );
}

function RadarSlide2({ d, chartImg }) {
  return (
    <div style={{ ...slideBase, padding: "16px 18px 36px" }}>
      <CornerMark color={T.gold} />
      <SlideNum n={2} color={T.muted} />
      <div style={{ position: "relative", zIndex: 2 }}>
        <RadarBadge />
        <div style={{ marginTop: 8, fontSize: 14, fontWeight: 900, letterSpacing: -0.3 }}>CHART <span style={{ color: T.gold }}>IN FOCUS</span></div>
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
            <div style={{ fontSize: 12, fontWeight: 900, color: T.gold, letterSpacing: -0.5 }}>{d.ticker}</div>
          </div>
          {/* Zone status */}
          <div style={{ flex: 1, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "10px 14px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontSize: 7.5, color: T.muted, fontWeight: 700, letterSpacing: 1, marginBottom: 5 }}>ZONE STATUS</div>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: d.zoneColor || T.gold, boxShadow: `0 0 8px ${d.zoneColor || T.gold}`, flexShrink: 0 }} />
              <div style={{ fontSize: 12, fontWeight: 900, color: d.zoneColor || T.gold, letterSpacing: 0.3 }}>{d.zone}</div>
            </div>
          </div>
        </div>
      </div>
      <Brand name={d.brand} />
    </div>
  );
}

function RadarSlide3({ d }) {
  return (
    <div style={{ ...slideBase, padding: "20px 22px 36px" }}>
      <GridOverlay />
      <div style={{ position: "absolute", bottom: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.14) 0%, transparent 65%)", zIndex: 0 }} />
      <CornerMark color={T.gold} />
      <SlideNum n={3} color={T.muted} />
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
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: 44,
            background: "linear-gradient(to top, rgba(11,12,20,0.92), transparent)",
            display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 8,
          }}>
            <span style={{ fontSize: 8.5, fontWeight: 800, color: T.violet, letterSpacing: 2, textTransform: "uppercase" }}>
              ← Swipe for the answer →
            </span>
          </div>
        </div>

        {/* Brief description */}
        {d.hookDesc && (
          <div style={{ marginTop: 10, fontSize: 10, color: T.mutedLight, lineHeight: 1.6, fontWeight: 500 }}>{d.hookDesc}</div>
        )}

        {/* Ticker + timeframe row (no difficulty) */}
        <div style={{ display: "flex", gap: 7, marginTop: 10 }}>
          <div style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 8, padding: "6px 12px", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 9, fontWeight: 800, color: T.violet, letterSpacing: 1 }}>TICKER</span>
            <span style={{ fontSize: 11, fontWeight: 900, color: T.white }}>{d.ticker}</span>
          </div>
          <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "6px 12px", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 9, fontWeight: 800, color: T.muted, letterSpacing: 1 }}>TIMEFRAME</span>
            <span style={{ fontSize: 11, fontWeight: 800, color: T.mutedLight }}>{d.timeframe}</span>
          </div>
        </div>
      </div>
      <Brand name={d.brand} />
    </div>
  );
}

/* Slide 2 — REVEAL: annotated chart with pattern markers */
function BdSlide2({ d, chartImg }) {
  return (
    <div style={{ ...slideBase, padding: "16px 18px 36px", background: "#0b0c14" }}>
      <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 65%)", zIndex: 0 }} />
      <CornerMark color={T.violet} />
      <SlideNum n={2} color={T.muted} />

      <div style={{ position: "relative", zIndex: 2 }}>
        <BreakdownBadge />
        <div style={{ marginTop: 8, fontSize: 14, fontWeight: 900, letterSpacing: -0.3 }}>
          THE <span style={{ color: T.violet }}>{d.patternName}</span> REVEALED
        </div>

        {/* Annotated chart */}
        <div style={{
          marginTop: 8, borderRadius: 10, overflow: "hidden",
          height: 200, background: T.surface,
          border: `1px solid rgba(139,92,246,0.3)`,
          display: "flex", alignItems: "center", justifyContent: "center", position: "relative",
        }}>
          {chartImg
            ? <img src={chartImg} alt="chart" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            : <div style={{ textAlign: "center", color: T.muted, fontSize: 11 }}><div style={{ fontSize: 24, marginBottom: 4 }}>📈</div>Chart renders here</div>
          }
          {/* Floating annotation badges — positioned by user config */}
          {d.annotations.map((ann, i) => (
            <div key={i} style={{
              position: "absolute",
              top: ann.top != null ? `${ann.top}%` : undefined,
              bottom: ann.bottom != null ? `${ann.bottom}%` : undefined,
              left: ann.left != null ? `${ann.left}%` : undefined,
              right: ann.right != null ? `${ann.right}%` : undefined,
              background: ann.color === "green"  ? "rgba(16,185,129,0.9)"
                        : ann.color === "red"    ? "rgba(239,68,68,0.9)"
                        : ann.color === "gold"   ? "rgba(245,158,11,0.9)"
                        :                          "rgba(139,92,246,0.9)",
              borderRadius: 5, padding: "2px 7px",
              fontSize: 8, fontWeight: 800, color: T.white, whiteSpace: "nowrap",
            }}>{ann.label}</div>
          ))}
        </div>

        {/* Pattern signature stats row */}
        <div style={{ display: "flex", gap: 6, marginTop: 9 }}>
          {[
            { label: "PATTERN",    val: d.patternName,    color: T.violet },
            { label: "AVG MOVE",   val: d.avgMove,        color: T.gold },
            { label: "TIMEFRAME",  val: d.timeframe,      color: T.mutedLight },
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
  watchReason: [
    { icon: "📊", text: "8-month base breakout with expanding volume on the weekly chart." },
    { icon: "🏭", text: "Electronics PLI tailwind — sector getting institutional attention." },
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

/* ═══════════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════════ */
const TEMPLATES = [
  { id: "edu",       label: "📚 Education",  accent: "#3b82f6" },
  { id: "radar",     label: "📡 Radar",      accent: "#f59e0b" },
  { id: "review",    label: "📋 Review",     accent: "#10b981" },
  { id: "breakdown", label: "🔍 Breakdown",  accent: "#8b5cf6" },
  { id: "concept",   label: "💡 Concept",    accent: "#06b6d4" },
];

export default function App() {
  const [template, setTemplate]       = useState("edu");
  const [tab, setTab]                 = useState("preview");
  const [activeSlide, setActiveSlide] = useState(0);
  const [chartImg, setChartImg]       = useState(null);
  const [eduData, setEduData]         = useState(DEFAULT_EDU);
  const [radarData, setRadarData]     = useState(DEFAULT_RADAR);
  const [reviewData, setReviewData]   = useState(DEFAULT_REVIEW);
  const [bdData, setBdData]           = useState(DEFAULT_BREAKDOWN);
  const [ccData, setCcData]           = useState(DEFAULT_CONCEPT);
  const fileRef = useRef();

  const handleChartUpload = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setChartImg(ev.target.result);
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
      <RadarSlide2 d={radarData} chartImg={chartImg} />,
      <RadarSlide3 d={radarData} />,
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
      <BdSlide2 d={bdData} chartImg={chartImg} />,
      <BdSlide3 d={bdData} />,
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

  const updEduWhy      = (i, f, v) => { const a = [...eduData.whyPoints];      a[i] = { ...a[i], [f]: v }; updEdu("whyPoints", a); };
  const updEduStep     = (i, f, v) => { const a = [...eduData.patternSteps];    a[i] = { ...a[i], [f]: v }; updEdu("patternSteps", a); };
  const updRadarSetup  = (i, f, v) => { const a = [...radarData.setupPoints];   a[i] = { ...a[i], [f]: v }; updRadar("setupPoints", a); };
  const updReviewLearn = (i, f, v) => { const a = [...reviewData.learnings];    a[i] = { ...a[i], [f]: v }; updReview("learnings", a); };
  const updBdRule      = (i, f, v) => { const a = [...bdData.rules];            a[i] = { ...a[i], [f]: v }; updBd("rules", a); };
  const updCcPoint     = (i, v)    => { const a = [...ccData.keyPoints];        a[i] = v;                   updCc("keyPoints", a); };

  const slideLabels = (count) => {
    const noDisclaimer = ["breakdown", "concept"];
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
            {slides[safeActive]}
          </div>

          {/* Thumbnail strip */}
          <div style={{ marginTop: 24 }}>
            <div style={{ fontSize: 10, color: T.muted, fontWeight: 700, letterSpacing: 1.5, marginBottom: 10, textTransform: "uppercase" }}>All Slides — click to select</div>
            <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8 }}>
              {slides.map((s, i) => (
                <div key={i} onClick={() => setActiveSlide(i)} style={{
                  width: SW * 0.27, height: SH * 0.27, flexShrink: 0, cursor: "pointer",
                  borderRadius: 6, overflow: "hidden",
                  outline: safeActive === i ? `2.5px solid ${currentAccent}` : `1px solid ${T.border}`,
                  position: "relative",
                }}>
                  <div style={{ transform: `scale(0.27)`, transformOrigin: "top left", width: SW, height: SH, pointerEvents: "none" }}>{s}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Download panel */}
          <div style={{ marginTop: 28, background: T.surface, border: `1px solid ${currentAccent}33`, borderRadius: 14, padding: "20px 22px" }}>
            <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 6, color: currentAccent }}>📲 Export for Instagram</div>
            <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.6, marginBottom: 16, fontWeight: 500 }}>
              Exports all {slides.length} slides as <strong style={{ color: T.white }}>1080×1080 px PNG</strong> files ready for an Instagram carousel. Downloads as a ZIP.
            </div>
            <DownloadButton slides={slides} template={template} accent={currentAccent} />
          </div>
        </div>
      )}

      {/* ── Edit Tab ── */}
      {tab === "edit" && (
        <div style={{ padding: "20px", maxWidth: 560, margin: "0 auto" }}>

          {/* Chart upload — shown for templates that use a chart */}
          {["edu","radar","review","breakdown"].includes(template) && (
            <div style={{ background: T.surface, border: `2px dashed ${T.borderLight}`, borderRadius: 14, padding: 18, marginBottom: 20, textAlign: "center" }}>
              <div style={{ fontWeight: 800, fontSize: 12, marginBottom: 10, color: currentAccent }}>📈 Chart Screenshot</div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleChartUpload} style={{ display: "none" }} />
              <button onClick={() => fileRef.current.click()} style={{ background: currentAccent, border: "none", color: T.white, borderRadius: 8, padding: "8px 18px", cursor: "pointer", fontWeight: 700, fontSize: 12, fontFamily: T.font }}>
                {chartImg ? "🔄 Replace Chart" : "📂 Upload Chart"}
              </button>
              {chartImg && <img src={chartImg} alt="preview" style={{ marginTop: 12, maxHeight: 90, borderRadius: 8, display: "block", margin: "12px auto 0", maxWidth: "100%", objectFit: "contain" }} />}
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
              <SectionHead title="Cover" color="#f59e0b" />
              <Field label="Week Label"  value={radarData.weekLabel}  onChange={v => updRadar("weekLabel", v)} />
              <Field label="Ticker"      value={radarData.ticker}     onChange={v => updRadar("ticker", v)} />
              <Field label="Sector"      value={radarData.sector || ""} onChange={v => updRadar("sector", v)} />
              <Field label="Exchange"    value={radarData.exchange || ""} onChange={v => updRadar("exchange", v)} />
              <Field label="Timeframe"   value={radarData.timeframe || ""} onChange={v => updRadar("timeframe", v)} />
              <Field label="Thesis (one-line)"  value={radarData.thesis || ""} onChange={v => updRadar("thesis", v)} multiline />
              <Field label="Subtitle"    value={radarData.subtitle}   onChange={v => updRadar("subtitle", v)} multiline />
              <SectionHead title="Chart Slide" color="#f59e0b" />
              <Field label="Zone Status (e.g. ACTIVE BREAKOUT, WAIT FOR PULLBACK)" value={radarData.zone || ""} onChange={v => updRadar("zone", v)} />
              <Field label="Zone Colour (hex)" value={radarData.zoneColor || "#10b981"} onChange={v => updRadar("zoneColor", v)} />
              {/* <SectionHead title="Why I'm Watching (Slide 1 bullets)" color="#f59e0b" />
              {(radarData.watchReason || []).map((r, i) => (
                <div key={i} style={{ display: "flex", gap: 6 }}>
                  <Field label="Icon" value={r.icon} onChange={v => { const a=[...radarData.watchReason]; a[i]={...a[i],icon:v}; updRadar("watchReason",a); }} />
                  <Field label="Text" value={r.text} onChange={v => { const a=[...radarData.watchReason]; a[i]={...a[i],text:v}; updRadar("watchReason",a); }} multiline />
                </div>
              ))} */}
              <SectionHead title="Setup Points" color="#f59e0b" />
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
              <Field label="Ticker"     value={bdData.ticker}        onChange={v => updBd("ticker", v)} />
              <Field label="Timeframe"  value={bdData.timeframe}     onChange={v => updBd("timeframe", v)} />
              <Field label={`Hook Question (use \\n to split lines)`} value={bdData.hookQuestion} onChange={v => updBd("hookQuestion", v)} multiline />
              <Field label="Brief Description" value={bdData.hookDesc || ""} onChange={v => updBd("hookDesc", v)} multiline />

              <SectionHead title="Slide 2 — Reveal" color="#8b5cf6" />
              <Field label="Pattern Name"  value={bdData.patternName} onChange={v => updBd("patternName", v)} />
              <Field label="Avg Move"      value={bdData.avgMove}     onChange={v => updBd("avgMove", v)} />
              <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: 12, marginBottom: 10 }}>
                <div style={{ fontSize: 10, color: "#8b5cf6", fontWeight: 800, marginBottom: 8 }}>Chart Annotations (positioned as % of chart area)</div>
                {bdData.annotations.map((ann, i) => (
                  <div key={i} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: i < bdData.annotations.length-1 ? `1px solid ${T.border}` : "none" }}>
                    <div style={{ fontSize: 9, color: T.muted, fontWeight: 700, marginBottom: 6 }}>Annotation {i + 1}</div>
                    <Field label="Label text" value={ann.label} onChange={v => { const a=[...bdData.annotations]; a[i]={...a[i],label:v}; updBd("annotations",a); }} />
                    <Field label="Color (green/red/gold/violet)" value={ann.color} onChange={v => { const a=[...bdData.annotations]; a[i]={...a[i],color:v}; updBd("annotations",a); }} />
                  </div>
                ))}
              </div>

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