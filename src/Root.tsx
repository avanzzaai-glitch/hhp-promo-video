import { Composition } from 'remotion';
import { ProductVideo } from './ProductVideo';
import { AvanzaPromo } from './AvanzaPromo';
import { AvanzaPromo2 } from './AvanzaPromo2';
import { PRODUCTS } from './products_data';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Avanzza Promo #1 — Automatización (cyan/purple) */}
      <Composition
        id="avanzza-promo"
        component={AvanzaPromo}
        durationInFrames={709}
        fps={30}
        width={1080}
        height={1920}
      />
      {/* Avanzza Promo #2 — 3 Pilares (naranja/dorado) */}
      <Composition
        id="avanzza-promo2"
        component={AvanzaPromo2}
        durationInFrames={708}
        fps={30}
        width={1080}
        height={1920}
      />
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
