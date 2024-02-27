/**
 * @fileOverview SearchPage component for displaying search results and related components.
 * @module SearchPage
 */

import React, { useState } from "react";
import { Row, Col, Container, Spinner } from "reactstrap";
import MealCard from "../components/MealCard.jsx";
import QuickOrder from "../components/QuickOrder.jsx";
import SavedMeals from "../components/SavedMeals.jsx";
import SearchBox from "../components/SearchBox.jsx";
import MealDataManager from "../utils/MealDataManager.js";
import InfiniteScroll from "react-infinite-scroll-component";

/**
 * Functional component representing the SearchPage.
 * @function SearchPage
 * @returns {JSX.Element} JSX for SearchPage component.
 */
const SearchPage = () => {
  /**
   * State for storing search results and related information.
   * @type {[string | Meal[], React.Dispatch<React.SetStateAction<string | Meal[]>>, number | boolean, React.Dispatch<React.SetStateAction<number | boolean>>]}
   */
  const [searchResults, setSearchResults] = useState("initial page load");
  const [query, setQuery] = useState("");
  const [numResults, setNumResults] = useState(-1);

  /**
   * Handles the search results obtained from the SearchBox component.
   * @param {Object} results - Object containing the list of results and total results count.
   * @param {Meal[]} results.resultsList - List of search results.
   * @param {number} results.totalResults - Total number of results.
   * @returns {void}
   */
  const handleSearchResults = (results) => {
    setSearchResults(results.resultsList);
    setNumResults(results.totalResults);
  };

  // Create an instance of MealDataManager for handling meal-related data.
  const mealDataManager = new MealDataManager();

  /**
   * JSX element representing a loading spinner.
   * @type {JSX.Element}
   */
  const spinner = (
    <Col className="d-flex m-5 p-0 justify-content-center">
      <Spinner>Loading</Spinner>
    </Col>
  );

  /**
   * Handles fetching more search results for infinite scroll.
   * @async
   * @returns {Promise<void>}
   */
  const fetchMoreResults = async () => {
    try {
      const spoonacularQueryResults =
        await mealDataManager.queryRecipeFromSpoonacular(
          query,
          searchResults.length
        );

      setSearchResults(
        searchResults.concat(spoonacularQueryResults.resultsList)
      );

      // Spoonacular caps results to 1000
      if (searchResults.length >= numResults || searchResults.length >= 999) {
        console.log(
          "searchResults.length=" +
            searchResults.length +
            " numResults=" +
            numResults
        );
        setNumResults(false);
      }
    } catch (error) {
      console.error("error: " + error);
    }
  };

  // Conditionally render the results
  let results;

  // If page loaded
  if (searchResults == "initial page load") {
    results = (
      <Col className="d-flex m-5 p-0 justify-content-center">
        <p className="text-secondary">search something</p>
      </Col>
    );
  } else if (Array.isArray(searchResults)) {
    // If there are results, render them using InfiniteScroll
    results = (
      <InfiniteScroll
        dataLength={searchResults.length}
        next={fetchMoreResults}
        hasMore={numResults}
        loader={spinner}
        endMessage={
          <Col className="d-flex m-5 p-0 justify-content-center">
            <p className="text-secondary">
              Total {searchResults.length} results
            </p>
          </Col>
        }
      >
        <Container className="d-flex col-12 flex-wrap mt-3">
          {searchResults.map((meal, index) => (
            <MealCard key={index} meal={meal} />
          ))}
        </Container>
      </InfiniteScroll>
    );
  } else if (!Array.isArray(searchResults)) {
    // If there are no results, render the spinner
    results = spinner;
  }

  /**
   * JSX element representing the entire SearchPage component.
   * @type {JSX.Element}
   */
  return (
    <Container>
      <h1 className="d-flex justify-content-center">Search for recipes</h1>
      <Row>
        <Container className="d-flex justify-content-center">
          <br></br>
          <SearchBox
            onSearch={handleSearchResults}
            query={query}
            setQuery={setQuery}
          />
        </Container>
      </Row>
      <Row>
        <Col className="col-2">
          <SavedMeals />
        </Col>
        <Container className="col-8">{results}</Container>
        <Col className="col-2">
          <QuickOrder />
        </Col>
      </Row>
    </Container>
  );
};

export default SearchPage;
