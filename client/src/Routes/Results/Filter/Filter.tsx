import {
  Button,
  Form,
  FormField,
  FormGroup,
  FormInput,
  Select,
} from "semantic-ui-react";
import "./Filter.scss";
import CitySelect from "../../../components/CitySelect/CitySelect";
import { sanitize, title } from "../../../lib/utils";
import { SearchParams } from "../../../models/post.model";
import { SetURLSearchParams } from "react-router-dom";
import { isEqual } from "lodash-es";
import { properyOptions, typeOptions } from "../../../lib/const";
import { useContext } from "react";
import { LoaderContext } from "../../../context/Loader.context";

interface FilterProps {
  onFilterChange: (params: SearchParams) => void;
  filterParams: SearchParams;
  onSearch: SetURLSearchParams;
  searchParams: SearchParams;
}

const Filter = ({
  onFilterChange: setFilterParams,
  onSearch: setSearchParams,
  filterParams,
  searchParams,
}: FilterProps) => {
  const { setLoading } = useContext(LoaderContext);

  const handleChange = (_e: any, props: any) => {
    filterParams = {
      ...filterParams,
      [props.name]: props.value,
    };
    setFilterParams(filterParams);
  };

  const handleSearch = () => {
    const newSearchParams = sanitize(filterParams);
    const oldSearchParams = sanitize(searchParams);
    if (!isEqual(oldSearchParams, newSearchParams)) {
      setLoading(true);
      setSearchParams(newSearchParams);
    }
  };
  const city = searchParams.city || "";

  return (
    <div className="filter">
      {city && (
        <div className="header">
          Search results for <b>{title(city)}</b>
        </div>
      )}
      <Form>
        <CitySelect
          name="city"
          fluid
          defaultValue={searchParams.city}
          onChange={handleChange}
        />
        <FormGroup widths="equal">
          <FormField
            name="type"
            control={Select}
            placeholder="Type"
            clearable
            fluid
            label="Type"
            defaultValue={searchParams.type}
            options={typeOptions}
            onChange={handleChange}
          />
          <FormField
            name="property"
            control={Select}
            placeholder="Property"
            fluid
            clearable
            label="Property"
            defaultValue={searchParams.property}
            options={properyOptions}
            onChange={handleChange}
          />

          <FormInput
            fluid
            type="number"
            name="minPrice"
            id="minprice"
            label="Min Price"
            placeholder="Min Price"
            defaultValue={searchParams.minPrice}
            onChange={handleChange}
          />
          <FormInput
            fluid
            type="number"
            name="maxPrice"
            id="maxprice"
            label="Max Price"
            placeholder="Max Price"
            defaultValue={searchParams.maxPrice}
            onChange={handleChange}
          />
          <FormInput
            fluid
            type="number"
            name="bedroom"
            id="bedroom"
            label="Bedroom"
            placeholder="Bedroom"
            defaultValue={searchParams.bedroom}
            onChange={handleChange}
          />
          <div className="filter-button">
            <Button
              type="button"
              icon="search"
              color="yellow"
              onClick={handleSearch}
            />
            <Button
              type="button"
              content="Search"
              color="yellow"
              size="large"
              onClick={handleSearch}
            />
          </div>
        </FormGroup>
      </Form>
    </div>
  );
};

export default Filter;
