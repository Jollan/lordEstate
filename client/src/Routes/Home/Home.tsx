import Page from "../../components/Page/Page";
import SearchBar from "./SearchBar/SearchBar";
import "./Home.scss";

const Home = () => {
  return (
    <Page className="home">
      <>
        <Page.PageLeft>
          <div className="content">
            <h1 className="ui dividing header">
              Find Real Easte & Get Your Dream Place
            </h1>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              Assumenda maiores rerum corrupti nam, molestias, nostrum
              laudantium ducimus sit eligendi possimus eaque cumque natus itaque
              incidunt sunt harum! Commodi, maiores quod.
            </p>
            <SearchBar />
            <div className="ui three statistics">
              <div className="statistic">
                <div className="value">16+</div>
                <div className="label">Years of Experience</div>
              </div>
              <div className="statistic">
                <div className="value">200</div>
                <div className="label">Award Gained</div>
              </div>
              <div className="statistic">
                <div className="value">1,200+</div>
                <div className="label">Property Ready</div>
              </div>
            </div>
          </div>
        </Page.PageLeft>
        <Page.PageRight>
          <div className="content">
            <img src="./bg.png" alt="background-image" />
          </div>
        </Page.PageRight>
      </>
    </Page>
  );
};

export default Home;
