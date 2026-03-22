import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Easing, Img, staticFile } from 'remotion';

interface ProductData {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  price: number;
  imageUrl: string | null;
  palette: { bg: string; accent: string; soft: string; light: string; text: string };
  emoji: string;
  tagline: string;
  benefits: string[];
  ingredients: string;
}

interface Props {
  product: ProductData;
}

const Particle: React.FC<{ x: number; y: number; delay: number; color: string }> = ({ x, y, delay, color }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [delay, delay + 20, delay + 60, delay + 90],
    [0, 0.7, 0.7, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const translateY = interpolate(frame, [delay, delay + 90], [0, -80], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const scale = interpolate(frame, [delay, delay + 45, delay + 90], [0, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      width: 8, height: 8, borderRadius: '50%',
      backgroundColor: color,
      opacity, transform: `translateY(${translateY}px) scale(${scale})`,
    }} />
  );
};

const BenefitRow: React.FC<{ text: string; index: number; startFrame: number; accent: string }> = ({ text, index, startFrame, accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delay = startFrame + index * 8;
  const progress = spring({ frame, fps, from: 0, to: 1, delay, config: { damping: 14, mass: 0.8 } });
  const slideX = interpolate(progress, [0, 1], [-60, 0]);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      transform: `translateX(${slideX}px)`,
      opacity: progress,
      marginBottom: 18,
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: '50%',
        backgroundColor: accent,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        boxShadow: `0 0 12px ${accent}80`,
      }}>
        <span style={{ fontSize: 14, color: '#fff' }}>✓</span>
      </div>
      <span style={{ fontSize: 28, color: '#FFFFFF', fontWeight: 600, fontFamily: 'sans-serif', letterSpacing: '-0.3px' }}>
        {text}
      </span>
    </div>
  );
};

export const ProductVideo: React.FC<Props> = ({ product }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Timing
  const INTRO_END = fps * 2;       // 0-2s: intro
  const PRODUCT_END = fps * 5;     // 2-5s: producto hero
  const BENEFITS_END = fps * 10;   // 5-10s: beneficios
  const OUTRO_START = fps * 11;    // 11-14s: CTA

  // Scene transitions
  const introOpacity = interpolate(frame, [0, fps * 0.5, INTRO_END - fps * 0.3, INTRO_END], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const productOpacity = interpolate(frame, [INTRO_END, INTRO_END + 15, PRODUCT_END - 10, PRODUCT_END], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const benefitsOpacity = interpolate(frame, [PRODUCT_END, PRODUCT_END + 10, BENEFITS_END - 10, BENEFITS_END], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const outroOpacity = interpolate(frame, [OUTRO_START, OUTRO_START + 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Product image scale
  const productScale = spring({ frame: frame - INTRO_END, fps, from: 0.6, to: 1, config: { damping: 12, mass: 1 } });
  const productRotate = interpolate(frame, [INTRO_END, INTRO_END + fps], [-5, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Glow pulse
  const glowPulse = Math.sin(frame / 15) * 0.3 + 0.7;

  // Particles positions
  const particles = [
    { x: 80, y: 400, delay: 30 }, { x: 200, y: 600, delay: 50 },
    { x: 500, y: 300, delay: 20 }, { x: 650, y: 700, delay: 70 },
    { x: 350, y: 900, delay: 40 }, { x: 900, y: 500, delay: 60 },
    { x: 750, y: 200, delay: 10 }, { x: 150, y: 850, delay: 80 },
  ];

  const { bg, accent, soft, light, text } = product.palette;

  return (
    <AbsoluteFill style={{ backgroundColor: bg, overflow: 'hidden' }}>
      {/* Background gradient overlay */}
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse at 50% 30%, ${accent}25 0%, transparent 70%)`,
      }} />

      {/* Floating particles */}
      {particles.map((p, i) => (
        <Particle key={i} x={p.x} y={p.y} delay={p.delay} color={accent} />
      ))}

      {/* Grid lines background */}
      <AbsoluteFill style={{
        backgroundImage: `linear-gradient(${accent}08 1px, transparent 1px), linear-gradient(90deg, ${accent}08 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />

      {/* ---- SCENE 1: INTRO ---- */}
      <AbsoluteFill style={{ opacity: introOpacity, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          fontSize: 120,
          marginBottom: 30,
          transform: `scale(${interpolate(frame, [0, fps * 0.5], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })})`,
          filter: `drop-shadow(0 0 30px ${accent})`,
        }}>
          {product.emoji}
        </div>
        <div style={{
          fontFamily: 'sans-serif',
          fontSize: 72,
          fontWeight: 900,
          color: '#FFFFFF',
          textAlign: 'center',
          letterSpacing: '-2px',
          lineHeight: 1.1,
          padding: '0 40px',
          opacity: interpolate(frame, [fps * 0.3, fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          {product.name}
        </div>
        <div style={{
          fontFamily: 'sans-serif',
          fontSize: 32,
          color: accent,
          marginTop: 16,
          fontWeight: 600,
          letterSpacing: 2,
          textTransform: 'uppercase',
          opacity: interpolate(frame, [fps * 0.6, fps * 1.2], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          Happy & Healthy Pets
        </div>
      </AbsoluteFill>

      {/* ---- SCENE 2: PRODUCT HERO ---- */}
      <AbsoluteFill style={{ opacity: productOpacity, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around', padding: '60px 40px' }}>
        {/* Product image */}
        <div style={{
          width: 380, height: 380,
          borderRadius: 40,
          overflow: 'hidden',
          transform: `scale(${productScale}) rotate(${productRotate}deg)`,
          boxShadow: `0 0 ${60 * glowPulse}px ${accent}80, 0 0 120px ${accent}30`,
          border: `3px solid ${accent}60`,
        }}>
          {product.imageUrl ? (
            <Img src={product.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              background: `linear-gradient(135deg, ${accent}40, ${soft}60)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 120,
            }}>
              {product.emoji}
            </div>
          )}
        </div>

        {/* Name + price */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'sans-serif', fontSize: 64, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-2px' }}>
            {product.name}
          </div>
          <div style={{ fontFamily: 'sans-serif', fontSize: 30, color: soft, fontWeight: 500, marginTop: 4 }}>
            {product.subtitle}
          </div>
          <div style={{
            marginTop: 20,
            display: 'inline-block',
            background: `linear-gradient(135deg, ${accent}, ${soft})`,
            borderRadius: 50,
            padding: '14px 40px',
          }}>
            <span style={{ fontFamily: 'sans-serif', fontSize: 40, fontWeight: 900, color: '#FFFFFF' }}>
              ${product.price} MXN
            </span>
          </div>
        </div>

        {/* Tagline */}
        <div style={{
          fontFamily: 'sans-serif',
          fontSize: 32,
          color: soft,
          textAlign: 'center',
          fontStyle: 'italic',
          padding: '0 30px',
          lineHeight: 1.4,
        }}>
          "{product.tagline}"
        </div>
      </AbsoluteFill>

      {/* ---- SCENE 3: BENEFITS ---- */}
      <AbsoluteFill style={{ opacity: benefitsOpacity, padding: '80px 60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{
          fontFamily: 'sans-serif',
          fontSize: 42,
          fontWeight: 900,
          color: accent,
          marginBottom: 40,
          letterSpacing: '-1px',
          textTransform: 'uppercase',
        }}>
          ¿Por qué {product.name}?
        </div>

        {product.benefits.map((b, i) => (
          <BenefitRow key={i} text={b} index={i} startFrame={PRODUCT_END + 5} accent={accent} />
        ))}

        <div style={{
          marginTop: 30,
          padding: '16px 24px',
          borderRadius: 16,
          border: `1px solid ${accent}40`,
          background: `${accent}10`,
        }}>
          <div style={{ fontFamily: 'sans-serif', fontSize: 22, color: soft, fontWeight: 500 }}>
            🔬 Ingredientes activos
          </div>
          <div style={{ fontFamily: 'sans-serif', fontSize: 24, color: '#FFFFFF', marginTop: 6, fontWeight: 600 }}>
            {product.ingredients}
          </div>
        </div>
      </AbsoluteFill>

      {/* ---- SCENE 4: CTA ---- */}
      <AbsoluteFill style={{
        opacity: outroOpacity,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: `linear-gradient(135deg, ${bg} 0%, ${accent}30 100%)`,
      }}>
        <div style={{ fontSize: 80, marginBottom: 20, filter: `drop-shadow(0 0 20px ${accent})` }}>
          {product.emoji}
        </div>
        <div style={{
          fontFamily: 'sans-serif',
          fontSize: 58,
          fontWeight: 900,
          color: '#FFFFFF',
          textAlign: 'center',
          letterSpacing: '-2px',
          lineHeight: 1.1,
          padding: '0 40px',
        }}>
          {product.name}
        </div>
        <div style={{ fontFamily: 'sans-serif', fontSize: 26, color: soft, marginTop: 10, fontWeight: 500 }}>
          Para perros y gatos · 100 tabletas
        </div>
        <div style={{
          marginTop: 40,
          background: accent,
          borderRadius: 50,
          padding: '20px 60px',
          boxShadow: `0 0 ${30 + Math.sin(frame / 10) * 10}px ${accent}`,
        }}>
          <span style={{ fontFamily: 'sans-serif', fontSize: 36, fontWeight: 900, color: '#FFFFFF', letterSpacing: 1 }}>
            🛒 Ordena ahora
          </span>
        </div>
        <div style={{ fontFamily: 'sans-serif', fontSize: 24, color: soft, marginTop: 30, opacity: 0.8 }}>
          happyandhealthypets.com
        </div>
        <div style={{
          marginTop: 16,
          fontFamily: 'sans-serif', fontSize: 20, color: '#FFFFFF80',
        }}>
          ⭐⭐⭐⭐⭐  +500 mascotas felices
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
