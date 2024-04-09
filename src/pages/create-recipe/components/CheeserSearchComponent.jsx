import React, { useState } from "react";
import { Input } from "reactstrap";
import ingredientsMap from "../../../customObjects/IngredientMap";

const CheeserSearchComponent = ({ onIngredientSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Convert ingredientsMap object to an array
  const ingredientsArray = Object.entries(ingredientsMap);

  // Filter ingredientsArray based on search term
  const filteredIngredients = ingredientsArray.filter(([id, name]) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleIngredientClick = (id, name) => {
    onIngredientSelect({ id, name });
  };

  return (
    <div className="d-flex">
      <div className="mr-3">
        <Input
          type="text"
          placeholder="Search ingredients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div>
        <ul className="list-unstyled">
          {filteredIngredients.map(([id, name]) => (
            <li
              key={id}
              onClick={() => handleIngredientClick(id, name)}
              style={{ cursor: "pointer" }}
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CheeserSearchComponent;
