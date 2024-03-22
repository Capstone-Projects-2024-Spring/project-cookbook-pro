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
