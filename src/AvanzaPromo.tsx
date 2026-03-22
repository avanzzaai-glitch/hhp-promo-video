import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Video,
  staticFile,
} from 'remotion';

// Script generado por Claude Sonnet
const SCRIPT = {
  palette: { bg: "#0a0e27", accent: "#00fff9", text: "#ffffff", secondary: "#8b5cf6" },
  subtitles: [
    { text: "Y tres,", start_frame: 0, end_frame: 20, style: "normal" },
    { text: "AUTOMATIZACIÓN.", start_frame: 21, end_frame: 50, style: "highlight" },
    { text: "Ponemos", start_frame: 51, end_frame: 70, style: "normal" },
    { text: "agentes de", start_frame: 71, end_frame: 90, style: "normal" },
    { text: "inteligencia", start_frame: 91, end_frame: 115, style: "normal" },
    { text: "ARTIFICIAL", start_frame: 116, end_frame: 145, style: "highlight" },
    { text: "a trabajar", start_frame: 146, end_frame: 175, style: "normal" },
    { text: "24-7 ⚡", start_frame: 176, end_frame: 210, style: "impact" },
    { text: "por ti.", start_frame: 211, end_frame: 240, style: "normal" },
    { text: "Deja de", start_frame: 241, end_frame: 270, style: "normal" },
    { text: "OPERAR ❌", start_frame: 271, end_frame: 300, style: "highlight" },
    { text: "y empieza a", start_frame: 301, end_frame: 330, style: "normal" },
    { text: "DIRIGIR 👑", start_frame: 331, end_frame: 370, style: "impact" },
    { text: "Ahora,", start_frame: 371, end_frame: 395, style: "normal" },
    { text: "todo esto", start_frame: 396, end_frame: 420, style: "normal" },
    { text: "parecerá complejo,", start_frame: 421, end_frame: 480, style: "normal" },
    { text: "pero si me", start_frame: 481, end_frame: 510, style: "normal" },
    { text: "comentas 💬", start_frame: 511, end_frame: 545, style: "highlight" },
    { text: "\"CAMBIO\" 🔥", start_frame: 546, end_frame: 580, style: "impact" },
    { text: "te regalamos", start_frame: 581, end_frame: 610, style: "normal" },
    { text: "📄 PDF GRATIS", start_frame: 611, end_frame: 640, style: "highlight" },
    { text: "con los 3 pasos", start_frame: 641, end_frame: 670, style: "normal" },
    { text: "Y consulta gratis 🚀", start_frame: 671, end_frame: 709, style: "impact" },
  ],
  overlays: [
    { type: "badge", text: "🤖 AUTOMATIZACIÓN IA", emoji: "🤖", start_frame: 0, end_frame: 55 },
    { type: "lower_third", text: "🔥 24/7 SIN DESCANSO", emoji: "⚡", start_frame: 180, end_frame: 240 },
    { type: "flash", text: "❌ DE OPERADOR", emoji: "❌", start_frame: 271, end_frame: 305 },
    { type: "flash", text: "👑 A DIRECTOR", emoji: "👑", start_frame: 331, end_frame: 375 },
    { type: "badge", text: "💬 Comenta: CAMBIO", emoji: "💬", start_frame: 511, end_frame: 582 },
    { type: "lower_third", text: "🎁 PDF GRATIS", emoji: "📄", start_frame: 611, end_frame: 670 },
  ],
  cta: {
    text: "💬 Comenta: CAMBIO",
    subtext: "PDF + Consulta Gratis 🚀",
    start_frame: 660,
    end_frame: 709,
  },
};

// Partículas de fondo
const Particle: React.FC<{ x: number; y: number; size: number; speed: number; color: string }> = ({ x, y, size, speed, color }) => {
  const frame = useCurrentFrame();
  const yPos = ((y + frame * speed) % 1080);
  const opacity = interpolate(yPos, [0, 100, 900, 1080], [0, 0.6, 0.6, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div style={{
      position: 'absolute', left: x, top: yPos,
      width: size, height: size, borderRadius: '50%',
      backgroundColor: color, opacity,
      boxShadow: `0 0 ${size * 3}px ${color}`,
    }} />
  );
};

// Subtítulo animado
const Subtitle: React.FC<{ sub: typeof SCRIPT.subtitles[0] }> = ({ sub }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < sub.start_frame || frame > sub.end_frame) return null;

  const progress = spring({
    frame: frame - sub.start_frame,
    fps,
    from: 0, to: 1,
    config: { damping: 10, mass: 0.6, stiffness: 200 },
  });
  const exitProgress = interpolate(
    frame,
    [sub.end_frame - 5, sub.end_frame],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const isHighlight = sub.style === 'highlight';
  const isImpact = sub.style === 'impact';

  return (
    <div style={{
      position: 'absolute',
      bottom: 220,
      left: 0, right: 0,
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      transform: `scale(${progress * exitProgress})`,
      opacity: progress * exitProgress,
    }}>
      <div style={{
        background: isImpact
          ? `linear-gradient(135deg, ${SCRIPT.palette.accent}DD, ${SCRIPT.palette.secondary}DD)`
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
          fontSize: isImpact ? 72 : isHighlight ? 60 : 52,
          fontWeight: 900,
          color: isImpact ? '#000' : '#fff',
          textAlign: 'center',
          letterSpacing: isImpact ? '-1px' : '0px',
          textShadow: isImpact ? 'none' : '0 2px 20px rgba(0,0,0,0.8)',
        }}>
          {sub.text}
        </span>
      </div>
    </div>
  );
};

// Overlay animado
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
          <span style={{ fontFamily: 'Arial Black, sans-serif', fontSize: 34, fontWeight: 900, color: '#fff' }}>
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
          <span style={{ fontFamily: 'Arial Black, sans-serif', fontSize: 64, fontWeight: 900, color: '#fff' }}>
            {ov.text}
          </span>
        </div>
      </AbsoluteFill>
    );
  }

  return null;
};

// CTA Final
const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { cta } = SCRIPT;
  if (frame < cta.start_frame) return null;

  const progress = spring({ frame: frame - cta.start_frame, fps, from: 0, to: 1, config: { damping: 12 } });
  const pulse = Math.sin(frame / 8) * 0.05 + 1;

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

// Componente principal
export const AvanzaPromo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const VIDEO_URL = "https://base44.app/api/apps/69bcee79d908094d21d71ce3/files/mp/public/69bcee79d908094d21d71ce3/98bb47571_avanzza-source-video.mp4";

  const particles = [
    { x: 50, y: 200, size: 4, speed: 0.8, color: '#00fff9' },
    { x: 150, y: 500, size: 3, speed: 1.2, color: '#8b5cf6' },
    { x: 900, y: 100, size: 5, speed: 0.6, color: '#00fff9' },
    { x: 800, y: 700, size: 3, speed: 1.0, color: '#8b5cf6' },
    { x: 300, y: 900, size: 4, speed: 0.9, color: '#00fff9' },
    { x: 600, y: 300, size: 2, speed: 1.4, color: '#8b5cf6' },
    { x: 1000, y: 600, size: 4, speed: 0.7, color: '#00fff9' },
    { x: 200, y: 800, size: 3, speed: 1.1, color: '#00fff9' },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: SCRIPT.palette.bg, overflow: 'hidden' }}>
      {/* Fondo animado */}
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse at 50% 50%, ${SCRIPT.palette.secondary}15 0%, transparent 70%)`,
      }} />

      {/* Grid tech */}
      <AbsoluteFill style={{
        backgroundImage: `linear-gradient(${SCRIPT.palette.accent}06 1px, transparent 1px), linear-gradient(90deg, ${SCRIPT.palette.accent}06 1px, transparent 1px)`,
        backgroundSize: '80px 80px',
      }} />

      {/* Partículas */}
      {particles.map((p, i) => <Particle key={i} {...p} />)}

      {/* Video original centrado y recortado para 9:16 */}
      <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          position: 'relative',
          width: 1080,
          height: 1080,
          overflow: 'hidden',
          borderRadius: 0,
        }}>
          <Video
            src={VIDEO_URL}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          {/* Overlay gradient para integrar con fondo */}
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(to bottom, ${SCRIPT.palette.bg}CC 0%, transparent 20%, transparent 70%, ${SCRIPT.palette.bg}EE 100%)`,
          }} />
        </div>
      </AbsoluteFill>

      {/* Overlays */}
      {SCRIPT.overlays.map((ov, i) => <Overlay key={i} ov={ov} />)}

      {/* Subtítulos */}
      {SCRIPT.subtitles.map((sub, i) => <Subtitle key={i} sub={sub} />)}

      {/* CTA */}
      <CTA />

      {/* Avanzza watermark */}
      <div style={{
        position: 'absolute', top: 40, right: 40,
        fontFamily: 'Arial, sans-serif', fontSize: 26, fontWeight: 700,
        color: `${SCRIPT.palette.accent}99`,
        letterSpacing: 2,
      }}>
        AVANZZA.AI
      </div>
    </AbsoluteFill>
  );
};
