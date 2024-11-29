import {
  Placeholder,
  PlaceholderImage,
  Image,
  ImageProps,
} from "semantic-ui-react";
import "./ImageLoader.scss";
import { useState } from "react";
import { rctClass } from "../../lib/utils";

interface ImageLoaderProps extends ImageProps {}

const ImageLoader = ({ ...props }: ImageLoaderProps) => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="image-loader">
      <Placeholder fluid className={rctClass({ loading })}>
        <PlaceholderImage square />
      </Placeholder>
      <Image {...props} onLoad={() => setLoading(false)} />
    </div>
  );
};

export default ImageLoader;
