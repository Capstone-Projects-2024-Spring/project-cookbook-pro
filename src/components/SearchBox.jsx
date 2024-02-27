import React, { useState } from "react";
import MealDataManager from "../utils/MealDataManager.js";
import {
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  Input,
  InputGroup,
  Button,
  Container,
  Row,
  Col,
} from "reactstrap";

import SearchBoxFilter from "./SearchBoxFilter";

const mealDataManager = new MealDataManager();

/**
 * React component for a search box with filters.
 * @component
 * @param {Object} props - React component props.
 * @param {function} props.onSearch - Callback function triggered on search.
 * @param {string} props.query - Current search query.
 * @param {function} props.setQuery - Function to set the search query.
 * @returns {JSX.Element} SearchBox component.
 */
const SearchBox = ({ onSearch, query, setQuery }) => {
  // State variables
  const [dropdownOpen, setDropdownOpen] = useState(false);

  /**
   * Toggles the dropdown menu's visibility.
   * @function
   */
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  /**
   * Handles input change in the search box.
   * @function
   * @param {Object} e - Input change event.
   */
  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  // True/false search parameters, we can add as many as we want.
  // https://spoonacular.com/food-api/docs#Diets
  const [dietFilterOptions, setDietFilterOptions] = useState({
    Vegan: false,
    Vegetarian: false,
    "Gluten Free": false,
    Ketogenic: false,
    Pescetarian: false,
    Paleo: false,
  });

  // https://spoonacular.com/food-api/docs#Intolerances
  const [intoleranceFilterOptions, setIntoleranceFilterOptions] = useState({
    Diary: false,
    Egg: false,
    Gluten: false,
    Grain: false,
    Peanut: false,
    Seafood: false,
    Sesame: false,
    Shellfish: false,
    Soy: false,
    Sulfite: false,
    "Tree Nut": false,
    Wheat: false,
  });

  const [mealTypes, setMealTypes] = useState({
    "Main Course": false,
    "Side Dish": false,
    Dessert: false,
    Appetizer: false,
    Salad: false,
    Bread: false,
    Breakfast: false,
    Soup: false,
    Beverage: false,
    Sauce: false,
    Marinade: false,
    Fingerfood: false,
    Snack: false,
    Drink: false,
  });

  /**
   * Handles the search functionality.
   * @async
   * @function
   */
  const handleSearch = async () => {
    try {
      // Clear search results
      onSearch("yayspin! :D this string doesn't mean anything");

      // Wait for the query to complete and get the results
      const spoonacularQueryResults =
        await mealDataManager.queryRecipeFromSpoonacular(query, 0);

      // Pass the search results to the parent component
      onSearch(spoonacularQueryResults);
    } catch (error) {
      console.error(error); // Handle errors if the Promise is rejected
    }
  };

  return (
    <InputGroup className="w-50 min-width: 300px; shadow-lg" id="search-box">
      <Dropdown isOpen={dropdownOpen} toggle={toggle}>
        <DropdownToggle caret>Filter </DropdownToggle>
        <DropdownMenu>
          <Container className="m-2">
            <Row>
              <Col>
                <h6>Diets</h6>
                <SearchBoxFilter
                  setfilterOptions={setDietFilterOptions}
                  filterOptions={dietFilterOptions}
                />
              </Col>
              <Col>
                <h6>Allergies</h6>
                <SearchBoxFilter
                  setfilterOptions={setIntoleranceFilterOptions}
                  filterOptions={intoleranceFilterOptions}
                />
              </Col>
              <Col>
                <h6>Type</h6>
                <SearchBoxFilter
                  setfilterOptions={setMealTypes}
                  filterOptions={mealTypes}
                />
              </Col>
            </Row>
          </Container>
        </DropdownMenu>
      </Dropdown>

      <Input
        type="text"
        placeholder="Enter your search"
        value={query}
        onChange={handleInputChange}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />

      <Button color="primary" onClick={handleSearch}>
        Search🔍
      </Button>
    </InputGroup>
  );
};

export default SearchBox;
