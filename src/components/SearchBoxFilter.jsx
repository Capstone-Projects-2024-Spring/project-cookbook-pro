/**
 * SearchBox component for filtering options using checkboxes.
 * @typedef {Object} SearchBoxProps
 * @property {Function} setfilterOptions - A function to update filter options.
 * @property {Object} filterOptions - The current filter options.
 */

/**
 * Updates the filter option for a given key and triggers a re-render.
 * @callback CheckBoxChecked
 * @param {string} key - The keyfz of the filter option to update.
 */
import { Label, FormGroup, Form, Input } from "reactstrap";

const SearchBox = ({ setfilterOptions, filterOptions }) => {
  const checkBoxChecked = (key) => {
    filterOptions[key] = !filterOptions[key];
    setfilterOptions({ ...filterOptions });
  };

  return (
    <Form>
      {Object.entries(filterOptions).map(([key, value]) => {
        return (
          <FormGroup key={key} check>
            <Input
              type="checkbox"
              checked={value}
              onChange={() => checkBoxChecked(key)}
            />
            <Label check>{key}</Label>
          </FormGroup>
        );
      })}
    </Form>
  );
};

export default SearchBox;
