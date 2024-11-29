import { ImageGroup } from "semantic-ui-react";
import "./ImageGrid.scss";
import { useState } from "react";
import Slider from "../Slider/Slider";
import ImageLoader from "../../../components/ImageLoader/ImageLoader";

interface ImageGridProps {
  images: string[];
}

const ImageGrid = ({ images }: ImageGridProps) => {
  const [activeSlider, setActiveSlider] = useState(false);
  const [initial, setInitial] = useState(0);

  const [fluidImage, ...rest] = images.slice(0, 4);

  return (
    <div className="image-grid">
      {activeSlider && (
        <Slider
          images={images}
          initial={initial}
          onDeactivate={() => setActiveSlider(false)}
        />
      )}
      <div className="fluid-image-container">
        <ImageLoader
          fluid
          rounded
          src={fluidImage}
          onClick={() => {
            setInitial(0);
            setActiveSlider(true);
          }}
        />
      </div>
      {!!rest.length && (
        <ImageGroup size="small">
          {rest.map((image, index) => (
            <ImageLoader
              key={index}
              rounded
              src={image}
              onClick={() => {
                setInitial(index + 1);
                setActiveSlider(true);
              }}
            />
          ))}
        </ImageGroup>
      )}
    </div>
  );
};

export default ImageGrid;
