import React, { useState } from "react";
import "../order-history.css";

const Order = ({ recipeNames, ingredients, orderId }) => {

  const addClickedProperty = (ingredients) => {
    return ingredients.map(ingredient => ({...ingredient, clicked: false}));
  };

  const [expanded, setExpanded] = useState(false);
  const [parsedIngredients, setIngredients] = useState(addClickedProperty(ingredients));


  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleItemClick = (index) => {
    const updatedIngredients = [...parsedIngredients];
    updatedIngredients[index].clicked = !updatedIngredients[index].clicked;
    setIngredients(updatedIngredients);
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
              Array.isArray(parsedIngredients) &&
              parsedIngredients.map((ingredient, index) => (
                <li 
                  key={index}
                  style={{
                    textDecoration: ingredient.clicked ? "line-through" : "none",
                    cursor: "pointer"
                  }}
                  onClick={() => handleItemClick(index)}
                >
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
