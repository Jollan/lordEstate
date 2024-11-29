import {
  Placeholder,
  PlaceholderImage,
  PlaceholderLine,
} from "semantic-ui-react";
import "./ListPlaceholder.scss";

interface ListPlaceholderProps {
  lenght?: string;
}

const ListPlaceholder = ({ lenght = "I love God" }: ListPlaceholderProps) => {
  return (
    <div className="list-placeholder">
      {lenght.split("").map((_c, index) => (
        <div className="item" key={index}>
          <div className="image">
            <Placeholder fluid>
              <PlaceholderImage rectangular />
            </Placeholder>
          </div>
          <div className="content">
            <Placeholder fluid>
              <PlaceholderLine />
              <PlaceholderLine />
              <PlaceholderLine />
              <PlaceholderLine />
            </Placeholder>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListPlaceholder;
