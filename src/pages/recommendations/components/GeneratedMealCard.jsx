import React, { useState, useEffect } from "react";
import { Button, Card, CardBody, CardTitle, CardImg, Modal, ModalHeader, ModalBody } from "reactstrap";
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
      const openai = new OpenAI({
        apiKey: process.env.REACT_APP_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
      });
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: `Please generate a picture of ${recipe.name} that is a ${recipe.summary} in photorealistic style`,
        n: 1,
        size: "1024x1024",
      });
      setImageURL(response.data[0].url);
      console.log('Image generated successfully:', response.data[0].url);
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

  // Effect to automatically generate image when component mounts
  useEffect(() => {
    generateDalleImage();
  }, []);

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
            <CardImg top width="100%" src={imageURL} alt="Generated Recipe Image" onClick={toggleModal} />
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
        <Button className="meal-card-button" color="primary" onClick={() => setSelectedMeal({ ...recipe })}>
          Details
        </Button>
        <Button className="meal-card-button" color="success">Save</Button>
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
