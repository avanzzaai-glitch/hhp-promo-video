import { Composition } from 'remotion';
import { ProductVideo } from './ProductVideo';
import { AvanzaPromo } from './AvanzaPromo';
import { PRODUCTS } from './products_data';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Video editado de Avanzza */}
      <Composition
        id="avanzza-promo"
        component={AvanzaPromo}
        durationInFrames={709}
        fps={30}
        width={1080}
        height={1920}
      />
      {/* Serie de productos HHP */}
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
