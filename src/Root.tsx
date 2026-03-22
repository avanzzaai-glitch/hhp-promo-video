import { Composition } from 'remotion';
import { ProductVideo } from './ProductVideo';
import { AvanzaPromo } from './AvanzaPromo';
import { AvanzaPromo2 } from './AvanzaPromo2';
import { AvanzaPromo3 } from './AvanzaPromo3';
import { PRODUCTS } from './products_data';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Avanzza Promo #1 — Automatización (cyan/morado) */}
      <Composition id="avanzza-promo" component={AvanzaPromo}
        durationInFrames={709} fps={30} width={1080} height={1920} />
      {/* Avanzza Promo #2 — 3 Pilares (naranja/dorado) */}
      <Composition id="avanzza-promo2" component={AvanzaPromo2}
        durationInFrames={708} fps={30} width={1080} height={1920} />
      {/* Avanzza Promo #3 — Hook Mito vs Realidad (verde neón/rojo) */}
      <Composition id="avanzza-promo3" component={AvanzaPromo3}
        durationInFrames={192} fps={24} width={1080} height={1920} />
      {/* Serie productos HHP */}
      {PRODUCTS.map((product) => (
        <Composition
          key={product.id}
          id={`product-${product.id}`}
          component={ProductVideo}
          durationInFrames={420}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ product }}
        />
      ))}
    </>
  );
};
