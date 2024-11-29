import {
  Placeholder,
  PlaceholderHeader,
  PlaceholderImage,
  PlaceholderLine,
} from "semantic-ui-react";
import "./ResultsPlaceholder.scss";
import Page from "../../../components/Page/Page";
import ListPlaceholder from "../../../components/ListPlaceholder/ListPlaceholder";

const ResultsPlaceholder = () => {
  return (
    <>
      <Page.PageLeft className="placeholder">
        <div className="content">
          <Placeholder fluid>
            <PlaceholderHeader>
              <PlaceholderLine />
              <PlaceholderLine />
              <PlaceholderLine />
            </PlaceholderHeader>
          </Placeholder>
          <ListPlaceholder />
        </div>
      </Page.PageLeft>
      <Page.PageRight className="placeholder">
        <div className="content">
          <Placeholder fluid>
            <PlaceholderImage />
          </Placeholder>
        </div>
      </Page.PageRight>
    </>
  );
};

export default ResultsPlaceholder;
