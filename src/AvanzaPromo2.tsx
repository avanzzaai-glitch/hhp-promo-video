import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Video,
} from 'remotion';

// Script generado por Claude Sonnet — Pilares 1 y 2
const SCRIPT = {
  palette: { bg: "#0F0F0F", accent: "#FF6B35", text: "#FFFFFF", secondary: "#FFC857" },
  subtitles: [
    { text: "Tu negocio debería darte", start_frame: 0, end_frame: 45, style: "normal" },
    { text: "más LIBERTAD 🕊️", start_frame: 45, end_frame: 75, style: "impact" },
    { text: "no más trabajo", start_frame: 75, end_frame: 105, style: "normal" },
    { text: "En Avanzza logramos eso", start_frame: 105, end_frame: 150, style: "normal" },
    { text: "implementando 3 pilares", start_frame: 150, end_frame: 195, style: "highlight" },
    { text: "1️⃣ Marketing con IA", start_frame: 195, end_frame: 255, style: "impact" },
    { text: "Hacemos campañas", start_frame: 255, end_frame: 285, style: "normal" },
    { text: "posts de Instagram", start_frame: 285, end_frame: 315, style: "normal" },
    { text: "lo que necesites", start_frame: 315, end_frame: 345, style: "normal" },
    { text: "para atraer clientes ADECUADOS ✅", start_frame: 345, end_frame: 390, style: "highlight" },
    { text: "no solo preguntones 😅", start_frame: 390, end_frame: 435, style: "normal" },
    { text: "2️⃣ Digitalización", start_frame: 435, end_frame: 495, style: "impact" },
    { text: "Para matar el CAOS del Excel 💀", start_frame: 495, end_frame: 555, style: "highlight" },
    { text: "y tener un espacio total", start_frame: 555, end_frame: 600, style: "normal" },
    { text: "en una sola app 📱", start_frame: 600, end_frame: 645, style: "normal" },
  ],
  overlays: [
    { type: "flash", text: "😰 ¿Ahogado en tareas?", emoji: "😰", start_frame: 0, end_frame: 75 },
    { type: "badge", text: "🎯 3 Pilares", emoji: "🎯", start_frame: 150, end_frame: 195 },
    { type: "lower_third", text: "🤖 PILAR 1", emoji: "🤖", start_frame: 195, end_frame: 255 },
    { type: "badge", text: "✨ Marketing + IA", emoji: "✨", start_frame: 255, end_frame: 315 },
    { type: "flash", text: "💎 Clientes de calidad", emoji: "💎", start_frame: 345, end_frame: 390 },
    { type: "lower_third", text: "⚡ PILAR 2", emoji: "⚡", start_frame: 435, end_frame: 495 },
    { type: "badge", text: "👋 Adiós Excel", emoji: "👋", start_frame: 495, end_frame: 555 },
    { type: "flash", text: "📱 Todo en 1 app", emoji: "📱", start_frame: 600, end_frame: 645 },
  ],
  cta: {
    text: "¿Listo para crecer? 🚀",
    subtext: "Conoce el Pilar 3 👇",
    start_frame: 645,
    end_frame: 708,
  },
};

const VIDEO_URL = "https://base44.app/api/apps/69bcee79d908094d21d71ce3/files/mp/public/69bcee79d908094d21d71ce3/d535a59ad_avanzza-source-video2.mp4";

// Partícula de fondo
const Particle: React.FC<{ x: number; y: number; size: number; speed: number; color: string }> = ({ x, y, size, speed, color }) => {
  const frame = useCurrentFrame();
  const yPos = ((y + frame * speed) % 1080);
  const opacity = interpolate(yPos, [0, 100, 900, 1080], [0, 0.5, 0.5, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div style={{
      position: 'absolute', left: x, top: yPos,
      width: size, height: size, borderRadius: '50%',
      backgroundColor: color, opacity,
      boxShadow: `0 0 ${size * 3}px ${color}`,
    }} />
  );
};

// Subtítulo
const Subtitle: React.FC<{ sub: typeof SCRIPT.subtitles[0] }> = ({ sub }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < sub.start_frame || frame > sub.end_frame) return null;

  const progress = spring({
    frame: frame - sub.start_frame, fps, from: 0, to: 1,
    config: { damping: 10, mass: 0.6, stiffness: 200 },
  });
  const exitP = interpolate(frame, [sub.end_frame - 5, sub.end_frame], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const isHighlight = sub.style === 'highlight';
  const isImpact = sub.style === 'impact';

  return (
    <div style={{
      position: 'absolute', bottom: 220, left: 0, right: 0,
      display: 'flex', justifyContent: 'center',
      transform: `scale(${progress * exitP})`,
      opacity: progress * exitP,
    }}>
      <div style={{
        background: isImpact
          ? `linear-gradient(135deg, ${SCRIPT.palette.accent}EE, ${SCRIPT.palette.secondary}EE)`
          : isHighlight
          ? `${SCRIPT.palette.accent}22`
          : 'rgba(0,0,0,0.75)',
        padding: isImpact ? '16px 40px' : '12px 30px',
        borderRadius: 16,
        border: isHighlight || isImpact ? `2px solid ${SCRIPT.palette.accent}` : 'none',
        backdropFilter: 'blur(10px)',
      }}>
        <span style={{
          fontFamily: 'Arial Black, sans-serif',
          fontSize: isImpact ? 68 : isHighlight ? 56 : 50,
          fontWeight: 900,
          color: isImpact ? '#000' : '#fff',
          textAlign: 'center',
          textShadow: isImpact ? 'none' : '0 2px 20px rgba(0,0,0,0.8)',
        }}>
          {sub.text}
        </span>
      </div>
    </div>
  );
};

// Overlay
const Overlay: React.FC<{ ov: typeof SCRIPT.overlays[0] }> = ({ ov }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < ov.start_frame || frame > ov.end_frame) return null;

  const progress = spring({ frame: frame - ov.start_frame, fps, from: 0, to: 1, config: { damping: 12 } });
  const exitP = interpolate(frame, [ov.end_frame - 8, ov.end_frame], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  if (ov.type === 'badge') {
    return (
      <div style={{
        position: 'absolute', top: 80, left: 40,
        transform: `translateX(${interpolate(progress, [0,1], [-300, 0])}px)`,
        opacity: progress * exitP,
      }}>
        <div style={{
          background: `linear-gradient(135deg, ${SCRIPT.palette.accent}, ${SCRIPT.palette.secondary})`,
          borderRadius: 50, padding: '14px 28px',
          boxShadow: `0 0 30px ${SCRIPT.palette.accent}80`,
        }}>
          <span style={{ fontFamily: 'Arial Black, sans-serif', fontSize: 32, fontWeight: 900, color: '#000' }}>
            {ov.text}
          </span>
        </div>
      </div>
    );
  }

  if (ov.type === 'lower_third') {
    return (
      <div style={{
        position: 'absolute', bottom: 380, left: 0, right: 0,
        display: 'flex', justifyContent: 'center',
        transform: `translateY(${interpolate(progress, [0,1], [60, 0])}px)`,
        opacity: progress * exitP,
      }}>
        <div style={{
          background: `${SCRIPT.palette.secondary}CC`,
          borderRadius: 12, padding: '12px 36px',
          border: `1px solid ${SCRIPT.palette.accent}60`,
        }}>
          <span style={{ fontFamily: 'Arial Black, sans-serif', fontSize: 38, fontWeight: 900, color: '#000' }}>
            {ov.text}
          </span>
        </div>
      </div>
    );
  }

  if (ov.type === 'flash') {
    const flashOpacity = interpolate(
      frame,
      [ov.start_frame, ov.start_frame + 5, ov.start_frame + 15, ov.end_frame - 5, ov.end_frame],
      [0, 1, 1, 1, 0],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
    const scaleVal = spring({ frame: frame - ov.start_frame, fps, from: 0.5, to: 1, config: { damping: 8 } });
    return (
      <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: flashOpacity }}>
        <div style={{
          background: `linear-gradient(135deg, ${SCRIPT.palette.accent}22, ${SCRIPT.palette.secondary}44)`,
          border: `3px solid ${SCRIPT.palette.accent}`,
          borderRadius: 20, padding: '20px 50px',
          transform: `scale(${scaleVal})`,
          boxShadow: `0 0 60px ${SCRIPT.palette.accent}60`,
        }}>
          <span style={{ fontFamily: 'Arial Black, sans-serif', fontSize: 60, fontWeight: 900, color: '#fff' }}>
            {ov.text}
          </span>
        </div>
      </AbsoluteFill>
    );
  }
  return null;
};

// CTA
const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { cta } = SCRIPT;
  if (frame < cta.start_frame) return null;

  const progress = spring({ frame: frame - cta.start_frame, fps, from: 0, to: 1, config: { damping: 12 } });
  const pulse = Math.sin(frame / 8) * 0.04 + 1;

  return (
    <div style={{
      position: 'absolute', bottom: 80, left: 40, right: 40,
      opacity: progress,
      transform: `translateY(${interpolate(progress, [0,1], [80, 0])}px)`,
    }}>
      <div style={{
        background: `linear-gradient(135deg, ${SCRIPT.palette.accent}, ${SCRIPT.palette.secondary})`,
        borderRadius: 24, padding: '24px 40px',
        textAlign: 'center',
        transform: `scale(${pulse})`,
        boxShadow: `0 0 50px ${SCRIPT.palette.accent}80`,
      }}>
        <div style={{ fontFamily: 'Arial Black, sans-serif', fontSize: 44, fontWeight: 900, color: '#000', lineHeight: 1.2 }}>
          {cta.text}
        </div>
        <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 28, fontWeight: 700, color: '#000000CC', marginTop: 8 }}>
          {cta.subtext}
        </div>
      </div>
    </div>
  );
};

export const AvanzaPromo2: React.FC = () => {
  const frame = useCurrentFrame();

  const particles = [
    { x: 60, y: 200, size: 4, speed: 0.8, color: '#FF6B35' },
    { x: 200, y: 500, size: 3, speed: 1.2, color: '#FFC857' },
    { x: 950, y: 100, size: 5, speed: 0.6, color: '#FF6B35' },
    { x: 820, y: 700, size: 3, speed: 1.0, color: '#FFC857' },
    { x: 400, y: 900, size: 4, speed: 0.9, color: '#FF6B35' },
    { x: 700, y: 300, size: 2, speed: 1.4, color: '#FFC857' },
    { x: 1020, y: 600, size: 4, speed: 0.7, color: '#FF6B35' },
    { x: 150, y: 800, size: 3, speed: 1.1, color: '#FFC857' },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: SCRIPT.palette.bg, overflow: 'hidden' }}>
      {/* Fondo radial */}
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse at 50% 50%, ${SCRIPT.palette.accent}12 0%, transparent 70%)`,
      }} />
      {/* Grid */}
      <AbsoluteFill style={{
        backgroundImage: `linear-gradient(${SCRIPT.palette.accent}06 1px, transparent 1px), linear-gradient(90deg, ${SCRIPT.palette.accent}06 1px, transparent 1px)`,
        backgroundSize: '80px 80px',
      }} />
      {/* Partículas */}
      {particles.map((p, i) => <Particle key={i} {...p} />)}

      {/* Video original */}
      <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'relative', width: 1080, height: 1080, overflow: 'hidden' }}>
          <Video src={VIDEO_URL} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(to bottom, ${SCRIPT.palette.bg}CC 0%, transparent 20%, transparent 70%, ${SCRIPT.palette.bg}EE 100%)`,
          }} />
        </div>
      </AbsoluteFill>

      {SCRIPT.overlays.map((ov, i) => <Overlay key={i} ov={ov} />)}
      {SCRIPT.subtitles.map((sub, i) => <Subtitle key={i} sub={sub} />)}
      <CTA />

      {/* Watermark */}
      <div style={{
        position: 'absolute', top: 40, right: 40,
        fontFamily: 'Arial, sans-serif', fontSize: 26, fontWeight: 700,
        color: `${SCRIPT.palette.accent}99`, letterSpacing: 2,
      }}>
        AVANZZA.AI
      </div>
    </AbsoluteFill>
  );
};
