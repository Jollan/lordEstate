import { Icon, Button } from "semantic-ui-react";
import { Link, useNavigate } from "react-router-dom";
import ImageLoader from "../ImageLoader/ImageLoader";
import { Post } from "../../models/post.model";
import { first } from "lodash-es";
import { useContext, useEffect, useState } from "react";
import { useSavePost } from "../../lib/hooks";
import { isOwnerPost, isPostSaved } from "../../lib/utils";
import { AuthContext } from "../../context/Auth.context";
import { UserPostListContext } from "../../context/UserPostList.context";
import { ProfileContext } from "../../context/Profile.context";

interface CardProps {
  post: Post;
}

const Card = ({ post }: CardProps) => {
  const [saved, setSaved] = useState<boolean>();

  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const { setOwnerId } = useContext(ProfileContext);
  const { setPost } = useContext(UserPostListContext);

  useEffect(() => {
    setSaved(!!isPostSaved(post, currentUser?.id));
  }, [post]);

  const handleSavePost = useSavePost(() => {
    setPost ? setPost({ ...post, saved: !saved }) : setSaved(!saved);
  });

  return (
    <div className="item">
      <div className="image">
        <ImageLoader
          as={Link}
          to={`/posts/${post.id}`}
          src={first(post.images)}
        />
      </div>
      <div className="content">
        <div className="header">{post.title}</div>
        <div className="meta">
          <Icon name="map marker alternate" size="large" />
          {post.address}
        </div>
        <div className="ui small olive tag label">${post.price}</div>
        <div className="extra">
          <div className="ui label">
            <i className="bed icon"></i>
            {post.bedroom} bedroom(s)
          </div>
          <div className="ui label">
            <i className="bath icon"></i>
            {post.bathroom} bathroom(s)
          </div>
          {!isOwnerPost(post, currentUser?.id) ? (
            <Button
              floated="right"
              basic
              icon="rocketchat"
              size="mini"
              onClick={() => {
                setOwnerId
                  ? setOwnerId(post.userId)
                  : navigate("/profile", { state: { ownerId: post.userId } });
              }}
            />
          ) : (
            <>
              <Button
                floated="right"
                basic
                icon={!post.hidden ? "hide" : "unhide"}
                size="mini"
              />
              <Button
                id="not-trash-sm"
                floated="right"
                basic
                icon="trash"
                size="mini"
              />
              <Button floated="right" basic icon="edit" size="mini" />
            </>
          )}

          <Button
            floated="right"
            basic={!saved}
            color="yellow"
            icon="bookmark outline"
            size="mini"
            onClick={() => handleSavePost(post.id)}
          />
        </div>
      </div>
    </div>
  );
};

export default Card;
