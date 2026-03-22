import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Video,
} from 'remotion';

// Guion generado por Claude Sonnet — Hook "Mito vs Realidad"
const SCRIPT = {
  palette: { bg: "#0A0E27", accent: "#00FF87", text: "#FFFFFF", secondary: "#FF0055" },
  subtitles: [
    { text: "Mucha gente", start_frame: 0, end_frame: 18, style: "normal" },
    { text: "CREE", start_frame: 18, end_frame: 30, style: "normal" },
    { text: "que para escalar", start_frame: 30, end_frame: 48, style: "normal" },
    { text: "un negocio", start_frame: 48, end_frame: 62, style: "normal" },
    { text: "hay que estar", start_frame: 62, end_frame: 76, style: "normal" },
    { text: "24-7 😵", start_frame: 76, end_frame: 88, style: "highlight" },
    { text: "pegado a la pantalla", start_frame: 88, end_frame: 108, style: "normal" },
    { text: "⚡ PERO LA VERDAD...", start_frame: 108, end_frame: 132, style: "impact" },
    { text: "el secreto NO es", start_frame: 132, end_frame: 148, style: "normal" },
    { text: "❌ trabajar MÁS", start_frame: 148, end_frame: 160, style: "highlight" },
    { text: "sino trabajar", start_frame: 160, end_frame: 172, style: "normal" },
    { text: "✅ MÁS INTELIGENTE", start_frame: 172, end_frame: 192, style: "impact" },
  ],
  overlays: [
    { type: "badge", text: "🚫 MITO", emoji: "🚫", start_frame: 0, end_frame: 108, side: "mito" },
    { type: "flash_white", text: "", emoji: "⚡", start_frame: 108, end_frame: 114 },
    { type: "badge", text: "💡 REALIDAD", emoji: "💡", start_frame: 114, end_frame: 168, side: "realidad" },
    { type: "lower_third", text: "😵 24/7 = BURNOUT", emoji: "😵", start_frame: 76, end_frame: 108 },
    { type: "mito_realidad", text: "❌ Trabajar MÁS", emoji: "❌", start_frame: 148, end_frame: 162, side: "mito" },
    { type: "mito_realidad", text: "✅ Trabajar INTELIGENTE", emoji: "✅", start_frame: 162, end_frame: 192, side: "realidad" },
  ],
  cta: {
    text: "👆 PARTE 2: Cómo lo hago",
    subtext: "Desliza para el sistema completo 🚀",
    start_frame: 168,
    end_frame: 192,
  },
};

const VIDEO_URL = "https://base44.app/api/apps/69bcee79d908094d21d71ce3/files/mp/public/69bcee79d908094d21d71ce3/386eadc12_avanzza-source-video3.mp4";

// Partícula
const Particle: React.FC<{ x: number; y: number; size: number; speed: number; color: string }> = ({ x, y, size, speed, color }) => {
  const frame = useCurrentFrame();
  const yPos = ((y + frame * speed * 1.5) % 1920);
  const opacity = interpolate(yPos, [0, 200, 1700, 1920], [0, 0.5, 0.5, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div style={{
      position: 'absolute', left: x, top: yPos,
      width: size, height: size, borderRadius: '50%',
      backgroundColor: color, opacity,
      boxShadow: `0 0 ${size * 4}px ${color}`,
    }} />
  );
};

// Subtítulo
const Subtitle: React.FC<{ sub: typeof SCRIPT.subtitles[0] }> = ({ sub }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < sub.start_frame || frame > sub.end_frame) return null;

  const isMitoPhase = frame < 108;
  const accentColor = isMitoPhase ? SCRIPT.palette.secondary : SCRIPT.palette.accent;

  const progress = spring({
    frame: frame - sub.start_frame, fps, from: 0, to: 1,
    config: { damping: 10, mass: 0.5, stiffness: 220 },
  });
  const exitP = interpolate(frame, [sub.end_frame - 4, sub.end_frame], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const isHighlight = sub.style === 'highlight';
  const isImpact = sub.style === 'impact';

  return (
    <div style={{
      position: 'absolute', bottom: 260, left: 0, right: 0,
      display: 'flex', justifyContent: 'center',
      transform: `scale(${progress * exitP})`,
      opacity: progress * exitP,
    }}>
      <div style={{
        background: isImpact
          ? `linear-gradient(135deg, ${accentColor}EE, ${accentColor}99)`
          : isHighlight
          ? `${accentColor}25`
          : 'rgba(0,0,0,0.80)',
        padding: isImpact ? '14px 36px' : '10px 26px',
        borderRadius: 14,
        border: isHighlight || isImpact ? `2px solid ${accentColor}` : 'none',
        backdropFilter: 'blur(12px)',
        maxWidth: 960,
      }}>
        <span style={{
          fontFamily: 'Arial Black, sans-serif',
          fontSize: isImpact ? 70 : isHighlight ? 58 : 50,
          fontWeight: 900,
          color: isImpact ? '#000' : '#fff',
          textAlign: 'center',
          display: 'block',
          textShadow: isImpact ? 'none' : '0 2px 20px rgba(0,0,0,0.9)',
          lineHeight: 1.1,
        }}>
          {sub.text}
        </span>
      </div>
    </div>
  );
};

// Overlay
const Overlay: React.FC<{ ov: any }> = ({ ov }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < ov.start_frame || frame > ov.end_frame) return null;

  const progress = spring({ frame: frame - ov.start_frame, fps, from: 0, to: 1, config: { damping: 12 } });
  const exitP = interpolate(frame, [ov.end_frame - 6, ov.end_frame], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  if (ov.type === 'badge') {
    const isMito = ov.side === 'mito';
    const color = isMito ? SCRIPT.palette.secondary : SCRIPT.palette.accent;
    return (
      <div style={{
        position: 'absolute', top: 60, left: 40,
        transform: `translateX(${interpolate(progress, [0,1], [-300, 0])}px)`,
        opacity: progress * exitP,
      }}>
        <div style={{
          background: `${color}EE`,
          borderRadius: 50, padding: '12px 24px',
          border: `2px solid ${color}`,
          boxShadow: `0 0 30px ${color}80`,
        }}>
          <span style={{ fontFamily: 'Arial Black, sans-serif', fontSize: 30, fontWeight: 900, color: '#000' }}>
            {ov.text}
          </span>
        </div>
      </div>
    );
  }

  if (ov.type === 'flash_white') {
    const flashOpacity = interpolate(
      frame, [ov.start_frame, ov.start_frame + 3, ov.end_frame],
      [0, 0.85, 0],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
    return (
      <AbsoluteFill style={{ backgroundColor: '#ffffff', opacity: flashOpacity }} />
    );
  }

  if (ov.type === 'lower_third') {
    return (
      <div style={{
        position: 'absolute', bottom: 420, left: 0, right: 0,
        display: 'flex', justifyContent: 'center',
        transform: `translateY(${interpolate(progress, [0,1], [50, 0])}px)`,
        opacity: progress * exitP,
      }}>
        <div style={{
          background: `${SCRIPT.palette.secondary}CC`,
          borderRadius: 12, padding: '10px 30px',
          border: `1px solid ${SCRIPT.palette.secondary}`,
        }}>
          <span style={{ fontFamily: 'Arial Black, sans-serif', fontSize: 32, fontWeight: 900, color: '#fff' }}>
            {ov.text}
          </span>
        </div>
      </div>
    );
  }

  if (ov.type === 'mito_realidad') {
    const isMito = ov.side === 'mito';
    const color = isMito ? SCRIPT.palette.secondary : SCRIPT.palette.accent;
    const scaleVal = spring({ frame: frame - ov.start_frame, fps, from: 0.4, to: 1, config: { damping: 8, stiffness: 250 } });
    return (
      <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: exitP }}>
        <div style={{
          background: `${color}22`,
          border: `3px solid ${color}`,
          borderRadius: 20, padding: '18px 44px',
          transform: `scale(${scaleVal})`,
          boxShadow: `0 0 60px ${color}60`,
          marginTop: -200,
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
  const pulse = Math.sin(frame / 5) * 0.04 + 1;

  return (
    <div style={{
      position: 'absolute', bottom: 60, left: 40, right: 40,
      opacity: progress,
      transform: `translateY(${interpolate(progress, [0,1], [80, 0])}px)`,
    }}>
      <div style={{
        background: `linear-gradient(135deg, ${SCRIPT.palette.accent}, #00cc6a)`,
        borderRadius: 24, padding: '20px 36px',
        textAlign: 'center',
        transform: `scale(${pulse})`,
        boxShadow: `0 0 50px ${SCRIPT.palette.accent}80`,
      }}>
        <div style={{ fontFamily: 'Arial Black, sans-serif', fontSize: 40, fontWeight: 900, color: '#000', lineHeight: 1.2 }}>
          {cta.text}
        </div>
        <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 26, fontWeight: 700, color: '#000000BB', marginTop: 6 }}>
          {cta.subtext}
        </div>
      </div>
    </div>
  );
};

export const AvanzaPromo3: React.FC = () => {
  const frame = useCurrentFrame();
  const isMitoPhase = frame < 108;
  const bgColor = SCRIPT.palette.bg;

  const particles = [
    { x: 80, y: 100, size: 5, speed: 1.2, color: isMitoPhase ? '#FF0055' : '#00FF87' },
    { x: 300, y: 400, size: 3, speed: 1.8, color: '#00FF87' },
    { x: 900, y: 200, size: 4, speed: 1.0, color: '#FF0055' },
    { x: 700, y: 800, size: 3, speed: 1.5, color: '#00FF87' },
    { x: 500, y: 600, size: 5, speed: 0.9, color: '#FF0055' },
    { x: 200, y: 1200, size: 3, speed: 1.3, color: '#00FF87' },
    { x: 1000, y: 500, size: 4, speed: 1.1, color: '#FF0055' },
  ];

  // Vignette de color según fase
  const mitoVignette = interpolate(frame, [90, 114], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const realidadVignette = interpolate(frame, [108, 130], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor, overflow: 'hidden' }}>
      {/* Vignette MITO (rojo) */}
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse at 50% 50%, transparent 40%, ${SCRIPT.palette.secondary}30 100%)`,
        opacity: mitoVignette,
      }} />
      {/* Vignette REALIDAD (verde) */}
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse at 50% 50%, transparent 40%, ${SCRIPT.palette.accent}30 100%)`,
        opacity: realidadVignette,
      }} />
      {/* Grid */}
      <AbsoluteFill style={{
        backgroundImage: `linear-gradient(${SCRIPT.palette.accent}05 1px, transparent 1px), linear-gradient(90deg, ${SCRIPT.palette.accent}05 1px, transparent 1px)`,
        backgroundSize: '80px 80px',
      }} />
      {/* Partículas */}
      {particles.map((p, i) => <Particle key={i} {...p} />)}

      {/* Video original — ya es vertical 720x1280, lo escalamos a 1080x1920 */}
      <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'relative', width: 1080, height: 1920, overflow: 'hidden' }}>
          <Video
            src={VIDEO_URL}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {/* Gradient overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(to bottom, ${bgColor}AA 0%, transparent 15%, transparent 65%, ${bgColor}F5 100%)`,
          }} />
        </div>
      </AbsoluteFill>

      {/* Flash blanco de transición */}
      {SCRIPT.overlays.filter(o => o.type === 'flash_white').map((ov, i) => <Overlay key={i} ov={ov} />)}
      {/* Overlays */}
      {SCRIPT.overlays.filter(o => o.type !== 'flash_white').map((ov, i) => <Overlay key={`ov-${i}`} ov={ov} />)}
      {/* Subtítulos */}
      {SCRIPT.subtitles.map((sub, i) => <Subtitle key={i} sub={sub} />)}
      {/* CTA */}
      <CTA />

      {/* Watermark */}
      <div style={{
        position: 'absolute', top: 36, right: 36,
        fontFamily: 'Arial, sans-serif', fontSize: 24, fontWeight: 700,
        color: `${SCRIPT.palette.accent}90`, letterSpacing: 2,
      }}>
        AVANZZA.AI
      </div>
    </AbsoluteFill>
  );
};
