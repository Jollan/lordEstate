import { Image } from "semantic-ui-react";
import "./Avatar.scss";

interface AvatarProps {
  image: string;
}

const Avatar = ({ image }: AvatarProps) => {
  return <Image className="avatar" src={image || "/noavatar.jpg"} />;
};

export default Avatar;
