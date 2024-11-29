import { Marker, Popup } from "react-leaflet";
import "./Pin.scss";
import { Post } from "../../models/post.model";
import { first } from "lodash-es";
import { Link } from "react-router-dom";
import L from "leaflet";

const markerIcon = L.icon({
  iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
  iconUrl: "https://unpkg.com/leaflet@1.5.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.5.1/dist/images/marker-shadow.png"
});

interface PinProps {
  post: Post;
}

const Pin = ({ post }: PinProps) => {
  return (
    <Marker position={[+post.latitude, +post.longitude]} icon={markerIcon}>
      <Popup className="popup">
        <div className="content">
          <img src={first(post.images)} alt="" />
          <div className="text">
            <Link to={`/posts/${post.id}`} className="title">
              {post.title}
            </Link>
            <span>{post.bedroom} bedroom</span>
            <b>${post.price}</b>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default Pin;
