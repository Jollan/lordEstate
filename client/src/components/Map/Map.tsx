import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./Map.scss";
import Pin from "../Pin/Pin";
import { Post } from "../../models/post.model";

interface MapProps {
  postList: Post[];
}

const Map = ({ postList }: MapProps) => {
  return (
    <MapContainer
      className="map"
      scrollWheelZoom
      center={
        postList.length > 1
          ? [51.505, -0.09]
          : [+postList[0]?.latitude!, +postList[0]?.longitude!]
      }
      zoom={7}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {postList.map((post, index) => (
        <Pin key={index} post={post} />
      ))}
    </MapContainer>
  );
};

export default Map;
