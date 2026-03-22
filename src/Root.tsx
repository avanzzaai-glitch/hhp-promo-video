import { Composition } from 'remotion';
import { ProductVideo } from './ProductVideo';
import { PRODUCTS } from './products_data';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {PRODUCTS.map((product) => (
        <Composition
          key={product.id}
          id={`product-${product.id}`}
          component={ProductVideo}
          durationInFrames={420} // 14 segundos a 30fps
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ product }}
        />
      ))}
    </>
  );
};
