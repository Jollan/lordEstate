import ImageLoader from "../ImageLoader/ImageLoader";
import UploadWidget from "../UploadWidget/UploadWidget";
import "./UploadAvatar.scss";

interface UploadAvatarProps {
  avatar: string;
  setAvatar: (value: string) => void;
}

const UploadAvatar = ({ avatar, setAvatar }: UploadAvatarProps) => {
  return (
    <div className="ctn-upload-avatar">
      <div className="label">Change the avatar</div>
      <div className="avatar">
        <ImageLoader
          bordered
          rounded
          src={avatar || "/noavatar.jpg"}
        />
      </div>
      <div className="upload-widget-container">
        <UploadWidget
          uwConfig={{
            cloudName: "dwfoq2qan",
            uploadPreset: "estate",
            multiple: false,
            maxImageFileSize: 2_000_000,
            folder: "avatars",
          }}
          consume={(result) => {
            setAvatar(result.info.secure_url);
          }}
        />
      </div>
    </div>
  );
};

export default UploadAvatar;
