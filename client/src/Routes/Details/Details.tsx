import {
  Button,
  Icon,
  List,
  ListContent,
  ListDescription,
  ListHeader,
  ListItem,
  Image,
  ButtonGroup,
  Dropdown,
} from "semantic-ui-react";
import "./Details.scss";
import ImageGrid from "./ImageGrid/ImageGrid";
import Avatar from "../../components/Avatar/Avatar";
import Map from "../../components/Map/Map";
import { Suspense, useContext, useState } from "react";
import {
  Await,
  defer,
  Link,
  LoaderFunction,
  useAsyncValue,
  useLoaderData,
} from "react-router-dom";
import Page from "../../components/Page/Page";
import { getPost } from "../../services/post";
import { Post } from "../../models/post.model";
import { petPolicyOptions, utilitiesPolicyOptions } from "../../lib/const";
import { isOwnerPost, isPostSaved, text, title } from "../../lib/utils";
import { AuthContext } from "../../context/Auth.context";
import { useSavePost } from "../../lib/hooks";
import DetailsPlaceholder from "./DetailsPlaceholder/DetailsPlaceholder";
import AsyncErrorPage from "../ErrorPage/AsyncErrorPage/AsyncErrorPage";

interface LoaderData {
  res: Axios.IPromise<Axios.AxiosXHR<Post>>;
}

export const loader: LoaderFunction = ({ params }) => {
  const res = getPost(params.id!);
  return defer({ res });
};

const options = [
  { key: "edit", icon: "edit", text: "Edit Post", value: "edit" },
  { key: "delete", icon: "delete", text: "Remove Post", value: "delete" },
  { key: "hide", icon: "hide", text: "Hide Post", value: "hide" },
];

const Details = () => {
  const data = useLoaderData() as LoaderData;

  return (
    <Page className="details" responsivity>
      <Suspense fallback={<DetailsPlaceholder />}>
        <Await resolve={data.res} errorElement={<AsyncErrorPage />}>
          <_Details />
        </Await>
      </Suspense>
    </Page>
  );
};

const _Details = () => {
  const { data: post } = useAsyncValue() as Axios.AxiosXHR<Post>;
  const { currentUser } = useContext(AuthContext);
  const [saved, setSaved] = useState(isPostSaved(post, currentUser?.id!));

  const handleSavePost = useSavePost(() => setSaved((saved) => !saved));

  return (
    <>
      <Page.PageLeft>
        <div className="content">
          <ImageGrid images={post.images} />
          <div className="info">
            <div className="text-content">
              <div className="title">{post.title}</div>
              <div className="address">
                <Icon name="map marker alternate" size="large" />
                {post.address}
              </div>
              <div className="price">
                <div className="ui olive tag label">${post.price}</div>
              </div>
            </div>
            <div className="avatar-wrapper">
              <Avatar image={post.user?.avatar!} />
              <div className="ownername">{title(post.user?.username!)}</div>
            </div>
          </div>
          <div className="description">{post.postDetail?.desc}</div>
        </div>
      </Page.PageLeft>
      <Page.PageRight>
        <div className="content">
          <div className="general section">
            <div className="label">General</div>
            <List relaxed>
              <ListItem>
                <Image className="icon" src="/utility.png" alt="utils-icon" />
                <ListContent>
                  <ListHeader>Utilities</ListHeader>
                  <ListDescription>
                    {text(utilitiesPolicyOptions, post.postDetail?.utilities)}
                  </ListDescription>
                </ListContent>
              </ListItem>
              <ListItem>
                <Image className="icon" src="/pet.png" alt="pet-policy-icon" />
                <ListContent>
                  <ListHeader>Pet Policy</ListHeader>
                  <ListDescription>
                    {text(petPolicyOptions, post.postDetail?.pet)}
                  </ListDescription>
                </ListContent>
              </ListItem>
              <ListItem>
                <Image className="icon" src="/fee.png" alt="fees-icon" />
                <ListContent>
                  <ListHeader>Property Fees</ListHeader>
                  <ListDescription>{post.postDetail?.income}</ListDescription>
                </ListContent>
              </ListItem>
            </List>
          </div>
          <div className="room-sizes section">
            <div className="label">Room Sizes</div>
            <div className="specifics">
              <div className="specific">
                <img className="icon" src="/size.png" alt="size-icon" />
                <div className="description">{post.postDetail?.size}sqm</div>
              </div>
              <div className="specific">
                <img className="icon" src="/bed.png" alt="bed-icon" />
                <div className="description">{post.bedroom} bedroom(s)</div>
              </div>
              <div className="specific">
                <img className="icon" src="/bath.png" alt="bath-icon" />
                <div className="description">{post.bathroom} bathroom(s)</div>
              </div>
            </div>
          </div>
          <div className="nearby-places section">
            <div className="label">Nearby Places</div>
            <List horizontal>
              <ListItem>
                <Image className="icon" src="/school.png" alt="school-icon" />
                <ListContent>
                  <ListHeader>School</ListHeader>
                  {post.postDetail?.school}m away
                </ListContent>
              </ListItem>
              <ListItem>
                <Image className="icon" src="/bus.png" alt="bus-icon" />
                <ListContent>
                  <ListHeader>Bus stop</ListHeader>
                  {post.postDetail?.bus}m away
                </ListContent>
              </ListItem>
              <ListItem>
                <Image className="icon" src="/restaurant.png" alt="resto" />
                <ListContent>
                  <ListHeader>Restaurant</ListHeader>
                  {post.postDetail?.restaurant}m away
                </ListContent>
              </ListItem>
            </List>
          </div>
          <div className="location section">
            <div className="label">Location</div>
            <div className="map-container">
              <Map postList={[post]} />
            </div>
          </div>
          <div className="actions">
            {!isOwnerPost(post, currentUser?.id) ? (
              <Button
                as={Link}
                to="/profile"
                state={{ ownerId: post.userId }}
                basic
                color="yellow"
                icon
                size="large"
              >
                <Icon name="rocketchat" />
                Send a message
              </Button>
            ) : (
              <ButtonGroup color="yellow" basic size="large">
                <Button style={{ cursor: "default" }}>Actions</Button>
                <Dropdown
                  className="button icon"
                  floating
                  options={options}
                  trigger={<></>}
                />
              </ButtonGroup>
            )}

            <Button
              basic={!saved}
              color="yellow"
              icon
              size="large"
              onClick={() => handleSavePost(post.id)}
            >
              <Icon name="bookmark outline" />
              {!saved ? "Save the place" : "Place Saved"}
            </Button>
          </div>
        </div>
      </Page.PageRight>
    </>
  );
};

export default Details;
