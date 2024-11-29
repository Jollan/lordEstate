import { Button } from "semantic-ui-react";
import "./SearchBar.scss";
import CitySelect from "../../../components/CitySelect/CitySelect";
import { toQuery } from "../../../lib/utils";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const SearchBar = () => {
  const [city, setCity] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData) as any;
    const query = toQuery({ ...data, city });
    navigate(`/posts?${query}`);
  };

  return (
    <form className="search" onSubmit={handleSubmit}>
      <div className="ui buttons">
        <input name="type" type="radio" value="buy" id="buy" hidden />
        <label className="ui button" htmlFor="buy">
          Buy
        </label>
        <div className="or"></div>
        <input name="type" type="radio" value="rent" id="rent" hidden />
        <label className="ui button" htmlFor="rent">
          Rent
        </label>
        <div className="or"></div>
        <input
          name="type"
          type="radio"
          id="any"
          value=""
          hidden
          defaultChecked
        />
        <label className="ui button" htmlFor="any">
          Any
        </label>
      </div>
      <div className="ui fluid attached segment action input">
        <CitySelect fluid onChange={(_e, { value }: any) => setCity(value)} />
        <input name="minPrice" type="number" placeholder="Min Price" />
        <input name="maxPrice" type="number" placeholder="Max Price" />
        <Button type="submit" icon="search" color="yellow" />
      </div>
    </form>
  );
};

export default SearchBar;
