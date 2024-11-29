import {
  Button,
  Form,
  FormField,
  FormGroup,
  Input,
  Segment,
  Grid,
  GridColumn,
  Message,
  FormTextArea,
  Reveal,
  RevealContent,
} from "semantic-ui-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./NewPost.scss";
import UploadWidget from "../../components/UploadWidget/UploadWidget";
import { useState } from "react";
import CitySelect from "../../components/CitySelect/CitySelect";
import Page from "../../components/Page/Page";
import { removeExtraWhiteSpace as __REXWS, sanitize } from "../../lib/utils";
import { PostInfo } from "../../models/post.model";
import { pick, without } from "lodash-es";
import { createPost } from "../../services/post";
import { useNavigate } from "react-router-dom";
import {
  petPolicyOptions,
  properyOptions,
  typeOptions,
  utilitiesPolicyOptions,
} from "../../lib/const";
import toast from "react-hot-toast";
import ImageLoader from "../../components/ImageLoader/ImageLoader";
import { useSessionExpiredModal } from "../../lib/hooks";

const NewPost = () => {
  const [images, setImages] = useState<string[]>([]);
  const [desc, setDesc] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const modal = useSessionExpiredModal();

  const navigate = useNavigate();

  const checkRequiredFields = () => {
    if (!images.length) {
      throw new Error("Please add at least one image.");
    }
    if (!desc) {
      throw new Error("Please provide a description.");
    }
    if (!city) {
      throw new Error("Please specify the city.");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();

    try {
      checkRequiredFields();

      const formData = new FormData(e.currentTarget);
      const inputs = Object.fromEntries(formData) as any;
      const data = sanitize(inputs);

      const postInfo: PostInfo = {
        postData: {
          ...pick(data, [
            "title",
            "address",
            "type",
            "property",
            "latitude",
            "longitude",
          ]),
          price: +data.price,
          bedroom: +data.bedroom,
          bathroom: +data.bathroom,
          images,
          city,
        },
        postDetail: {
          ...pick(data, ["utilities", "pet", "income"]),
          size: +data.size || undefined,
          school: +data.school || undefined,
          bus: +data.bus || undefined,
          restaurant: +data.restaurant || undefined,
          desc,
        },
      };

      const res = await createPost(postInfo);
      navigate(`/posts/${res.data.id}`);

      toast.success("Post created successfully!");
    } catch (error: any) {
      modal(error);
      const message = error.response?.data.message ?? error.message;
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page className="post" responsivity>
      <>
        <Page.PageLeft>
          <div className="content">
            <h2 className="ui header">Add New Post</h2>
            <Segment clearing color="black">
              <Form onSubmit={handleSubmit} loading={loading} error={!!error}>
                <FormGroup widths="equal">
                  <FormField
                    name="title"
                    id="title"
                    control={Input}
                    label="Title"
                    placeholder="Title"
                    required
                  />

                  <FormField
                    name="price"
                    type="number"
                    id="price"
                    control={Input}
                    label="Price"
                    placeholder="Price"
                    required
                  />

                  <FormField
                    name="address"
                    id="address"
                    control={Input}
                    label="Address"
                    placeholder="Address"
                    required
                  />
                </FormGroup>

                <div className="description required field">
                  <label>Description</label>
                  <ReactQuill
                    theme="snow"
                    value={desc}
                    onBlur={(_prev, _src, editor) => {
                      setDesc(__REXWS(editor.getText()));
                    }}
                  />
                </div>

                <FormGroup widths="equal">
                  <CitySelect
                    label="City"
                    allowAdditions
                    additionLabel="Custom location: "
                    noResultsMessage="Addition is allowed. Enter."
                    required
                    onChange={(_e, { value }: any) => {
                      setCity(__REXWS(value).toLowerCase());
                    }}
                  />

                  <FormField
                    name="bedroom"
                    type="number"
                    id="bedroom"
                    control={Input}
                    label="Bedroom"
                    placeholder="Bedroom"
                    required
                  />

                  <FormField
                    name="bathroom"
                    type="number"
                    id="bathroom"
                    control={Input}
                    label="Bathroom"
                    placeholder="Bathroom"
                    required
                  />
                </FormGroup>

                <FormGroup widths="equal">
                  <FormField
                    name="latitude"
                    type="number"
                    id="latitude"
                    control={Input}
                    label="Latitude"
                    placeholder="Latitude"
                    step="any"
                    min="-Infinity"
                    required
                  />

                  <FormField
                    name="longitude"
                    type="number"
                    id="longitude"
                    control={Input}
                    label="Longitude"
                    placeholder="Longitude"
                    step="any"
                    min="-Infinity"
                    required
                  />

                  <FormField
                    name="type"
                    id="type"
                    control="select"
                    label="Type"
                    required
                  >
                    {typeOptions.map((val, index) => (
                      <option key={index} value={val.value}>
                        {val.text}
                      </option>
                    ))}
                  </FormField>
                </FormGroup>

                <FormGroup widths="equal">
                  <FormField
                    name="property"
                    id="property"
                    control="select"
                    label="Property"
                    required
                  >
                    {properyOptions.map((val, index) => (
                      <option key={index} value={val.value}>
                        {val.text}
                      </option>
                    ))}
                  </FormField>

                  <FormField
                    name="utilities"
                    id="utilities"
                    control="select"
                    label="Utilities Policy"
                  >
                    {utilitiesPolicyOptions.map((val, index) => (
                      <option key={index} value={val.value}>
                        {val.text}
                      </option>
                    ))}
                  </FormField>

                  <FormField
                    name="pet"
                    id="pet"
                    control="select"
                    label="Pet Policy"
                  >
                    {petPolicyOptions.map((val, index) => (
                      <option key={index} value={val.value}>
                        {val.text}
                      </option>
                    ))}
                  </FormField>
                </FormGroup>

                <FormGroup widths="equal">
                  <FormField
                    name="income"
                    id="income-policy"
                    control={FormTextArea}
                    label="Income Policy"
                    placeholder="Income Policy"
                    rows={2}
                    style={{ resize: "none" }}
                  />

                  <FormField
                    name="size"
                    type="number"
                    id="total-size"
                    control={Input}
                    label="Total Size (sqft/m2)"
                    placeholder="Total Size"
                  />

                  <FormField
                    name="school"
                    type="number"
                    id="school"
                    control={Input}
                    label="School (Distance)"
                    placeholder="School"
                  />
                </FormGroup>

                <FormGroup widths="equal">
                  <FormField
                    name="bus"
                    type="number"
                    id="bus"
                    control={Input}
                    label="Bus (Distance)"
                    placeholder="Bus"
                  />
                  <FormField
                    name="restaurant"
                    type="number"
                    id="restaurant"
                    control={Input}
                    label="Restaurant (Distance)"
                    placeholder="Restaurant"
                  />
                </FormGroup>
                <Message
                  error
                  icon="times circle outline"
                  header="Something went wrong"
                  content={error}
                  onDismiss={() => setError("")}
                />
                <Button type="submit" secondary floated="right" size="large">
                  Add
                </Button>
              </Form>
            </Segment>
          </div>
        </Page.PageLeft>
        <Page.PageRight>
          <div className="content">
            <div className="label">
              {!images.length
                ? "Add images"
                : `${images.length} image(s) will be added`}
            </div>
            <div className="images">
              <Grid columns={2}>
                {images.map((image, index) => (
                  <GridColumn key={index}>
                    <Reveal animated="move down" instant>
                      <RevealContent visible>
                        <ImageLoader src={image} />
                      </RevealContent>
                      <RevealContent hidden>
                        <Button
                          icon="trash"
                          basic
                          inverted
                          negative
                          size="big"
                          onClick={() => {
                            setImages((images) => without(images, image));
                          }}
                        />
                      </RevealContent>
                    </Reveal>
                  </GridColumn>
                ))}
              </Grid>
            </div>
            <div className="upload-widget-container">
              <UploadWidget
                uwConfig={{
                  cloudName: "dwfoq2qan",
                  uploadPreset: "estate",
                  multiple: true,
                  maxImageFileSize: 2_000_000,
                  folder: "property_images",
                }}
                consume={(result) => {
                  setImages((images) => {
                    return [...images, result.info.secure_url];
                  });
                }}
              />
            </div>
          </div>
        </Page.PageRight>
      </>
    </Page>
  );
};

export default NewPost;
