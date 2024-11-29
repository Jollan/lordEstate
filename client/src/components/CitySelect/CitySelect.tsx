import {
  DropdownItemProps,
  FormField,
  FormSelectProps,
  Select,
} from "semantic-ui-react";
import "./CitySelect.scss";
import { useEffect, useState } from "react";
import Axios from "../../lib/http.client";
import { City } from "../../models/post.model";
import { title } from "../../lib/utils";
import toast from "react-hot-toast";

interface CitySelectProps extends Partial<FormSelectProps> {}

const CitySelect = ({ ...props }: CitySelectProps) => {
  const [cityOptions, setCityOptions] = useState<DropdownItemProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    (async function () {
      setLoading(true);
      try {
        const cities = await Axios.get<City[]>("/cities");

        const cityOptions = cities.data.map((city, key) => {
          return {
            key,
            text: title(city.name),
            value: city.name,
          };
        });

        setCityOptions(cityOptions);
      } catch (error) {
        toast.error("Something went wrong!");
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleAddition = (_e: any, { value }: any) => {
    if (value.trim()) {
      const option = {
        key: value,
        text: value,
        value: value,
      };
      setCityOptions((prev) => [option, ...prev]);
    }
  };

  return (
    <div className="ui form field">
      <FormField
        {...props}
        control={Select}
        clearable
        search
        placeholder="City"
        options={cityOptions}
        loading={loading}
        disabled={error}
        error={error}
        onAddItem={handleAddition}
      />
    </div>
  );
};

export default CitySelect;
