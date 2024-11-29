import { useContext } from "react";
import "./Loader.scss";
import { LoaderContext } from "../../context/Loader.context";

const Loader = () => {
  const { loading } = useContext(LoaderContext);
  
  return (
    <>
      {loading && (
        <div className="loader-overlay">
          <div className="loader-spinner"></div>
        </div>
      )}
    </>
  );
};

export default Loader;
