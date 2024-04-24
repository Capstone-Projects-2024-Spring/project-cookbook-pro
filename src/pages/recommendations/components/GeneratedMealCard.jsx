import React, { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  CardImg,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import RecipeDetails from "../../../components/RecipeDetails.jsx";
import OpenAI from "openai";

const GeneratedMealCard = ({ recipe }) => {
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

  const toggleModal = () => setIsModalOpen(!isModalOpen); // Toggle modal

  const buttonOptions = (
    <Button color="secondary" onClick={() => setSelectedMeal(null)}>
      Close
    </Button>
  );

  const generateDalleImage = async () => {
    try {
      const openai = new OpenAI(process.env.REACT_APP_OPENAI_API_KEY);
      const response = await openai.images.generate({
        prompt: `A delicious meal of ${recipe.name}`,
        size: "256x256",
        n: 1,
      });

      if (response.data && response.data[0].url) {
        setImageUrl(response.data[0].url);
      }
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  return (
    <div className="meal-card">
      <div className="meal-card-content">
        <CardTitle>
          <h5 className="meal-card-title text-truncate">{recipe.name}</h5>
        </CardTitle>
        <div className="meal-card-inspiration">
          Inspired by: {recipe.savedRecipeInspiration}
        </div>
        <div className="meal-card-summary">{recipe.summary}</div>

        {imageURL && (
          <>
            <CardImg
              top
              width="100%"
              src={imageURL}
              alt="Generated Recipe Image"
              onClick={toggleModal}
            />
            <Modal isOpen={isModalOpen} toggle={toggleModal}>
              <ModalHeader toggle={toggleModal}>{recipe.name}</ModalHeader>
              <ModalBody>
                <img src={imageURL} width="100%" alt="Full-size Recipe Image" />
              </ModalBody>
            </Modal>
          </>
        )}
      </div>
      <CardBody>
        <Button
          className="meal-card-button"
          color="primary"
          onClick={() => setSelectedMeal({ ...recipe })}
        >
          Details
        </Button>
        <Button className="meal-card-button" color="success">
          Save
        </Button>
        <Button
          className="meal-card-button"
          color="info"
          onClick={generateDalleImage}
        >
          Generate DALL-E Image
        </Button>
        <div className="meal-card-reasoning">{recipe.inspirationReasoning}</div>
        {selectedMeal && (
          <RecipeDetails
            meal={selectedMeal}
            buttonOptions={buttonOptions}
            isOpen={selectedMeal !== null}
          />
        )}
      </CardBody>
    </div>
  );
};

export default GeneratedMealCard;
