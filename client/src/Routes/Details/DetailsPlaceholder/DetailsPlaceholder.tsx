import {
  Placeholder,
  PlaceholderHeader,
  PlaceholderImage,
  PlaceholderLine,
  PlaceholderParagraph,
} from "semantic-ui-react";
import "./DetailsPlaceholder.scss";
import Page from "../../../components/Page/Page";

const DetailsPlaceholder = () => {
  return (
    <>
      <Page.PageLeft>
        <div className="content">
          <div className="image-grid">
            <div className="fluid-image-container">
              <Placeholder fluid>
                <PlaceholderImage rectangular />
              </Placeholder>
            </div>
            <div className="images-placeholder">
              <Placeholder>
                <PlaceholderImage />
              </Placeholder>
              <Placeholder>
                <PlaceholderImage />
              </Placeholder>
              <Placeholder>
                <PlaceholderImage />
              </Placeholder>
            </div>
          </div>
          <div className="info">
            <div className="text-content">
              <Placeholder>
                <PlaceholderHeader>
                  <PlaceholderLine />
                  <PlaceholderLine />
                  <PlaceholderLine />
                  <PlaceholderLine />
                  <PlaceholderLine />
                </PlaceholderHeader>
              </Placeholder>
            </div>
            <div className="avatar-wrapper">
              <Placeholder>
                <PlaceholderImage rectangular />
              </Placeholder>
            </div>
          </div>
          <div className="description">
            <Placeholder fluid>
              <PlaceholderParagraph>
                <PlaceholderLine />
                <PlaceholderLine />
                <PlaceholderLine />
                <PlaceholderLine />
                <PlaceholderLine />
              </PlaceholderParagraph>
              <PlaceholderParagraph>
                <PlaceholderLine />
                <PlaceholderLine />
                <PlaceholderLine />
              </PlaceholderParagraph>
            </Placeholder>
          </div>
        </div>
      </Page.PageLeft>
      <Page.PageRight>
        <div className="content">
          <div className="section">
            <Placeholder fluid>
              <PlaceholderHeader>
                <PlaceholderLine />
                <PlaceholderLine />
                <PlaceholderLine />
                <PlaceholderLine />
                <PlaceholderLine />
              </PlaceholderHeader>
            </Placeholder>
          </div>
          <div className="section">
            <Placeholder fluid>
              <PlaceholderHeader>
                <PlaceholderLine />
                <PlaceholderLine />
                <PlaceholderLine />
                <PlaceholderLine />
                <PlaceholderLine />
              </PlaceholderHeader>
            </Placeholder>
          </div>
          <div className="section">
            <Placeholder fluid>
              <PlaceholderHeader>
                <PlaceholderLine />
                <PlaceholderLine />
                <PlaceholderLine />
                <PlaceholderLine />
                <PlaceholderLine />
              </PlaceholderHeader>
            </Placeholder>
          </div>
          <div className="section location">
            <Placeholder fluid>
              <PlaceholderImage rectangular />
            </Placeholder>
          </div>
        </div>
      </Page.PageRight>
    </>
  );
};

export default DetailsPlaceholder;
