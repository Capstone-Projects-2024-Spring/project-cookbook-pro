import React, { useState } from "react";
import "../order-history.css";

const Order = ({ recipeNames, ingredients, orderId }) => {

  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="order-container">
      <div className="clickable-area-header" onClick={toggleExpand}>
        <h2>Order Details {orderId}</h2>
      </div>
      <div className="expand-content" style={{maxHeight: expanded ? 'fit-content' : '0'}}>
        <div className="recipe-names">
          <h3>Recipe Names</h3>
          <ul>
            {recipeNames &&
              recipeNames.map((recipe, index) => <li key={index}>{recipe}</li>)}
          </ul>
        </div>
        <div className="ingredients">
          <h3>Ingredients</h3>
          <ul>
            {ingredients &&
              Array.isArray(ingredients) &&
              ingredients.map((ingredient, index) => (
                <li key={index}>
                  {typeof ingredient === "object"
                    ? `${ingredient.name} (${ingredient.amount} ${ingredient.unit})`
                    : ingredient}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Order;
