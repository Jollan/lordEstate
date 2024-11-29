import "./Slider.scss";
import { Dimmer, Icon } from "semantic-ui-react";
import { useState } from "react";
import ImageLoader from "../../../components/ImageLoader/ImageLoader";

interface SliderProps {
  images: string[];
  initial: number;
  onDeactivate: () => void;
}

const Slider = ({ onDeactivate: deactivate, ...props }: SliderProps) => {
  const [pointer, setPointer] = useState(props.initial);

  return (
    <Dimmer className="slider" active page>
      <Icon name="close" size="big" link onClick={() => deactivate()} />
      <Icon
        name="chevron left"
        size="huge"
        link
        onClick={() => {
          const index = pointer - 1;
          if (index < 0) {
            setPointer(props.images.length - 1);
            return;
          }
          setPointer(index);
        }}
      />
      <div className="container">
        <ImageLoader fluid src={props.images[pointer]} />
      </div>
      <Icon
        name="chevron right"
        size="huge"
        link
        onClick={() => {
          const index = pointer + 1;
          if (index > props.images.length - 1) {
            setPointer(0);
            return;
          }
          setPointer(index);
        }}
      />
    </Dimmer>
  );
};

export default Slider;
