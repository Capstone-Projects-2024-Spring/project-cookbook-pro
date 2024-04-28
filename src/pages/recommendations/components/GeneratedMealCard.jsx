import React, { useState, useEffect } from 'react';
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
import FirestoreService from "../../../firebase/FirebaseService";
import { useAuth } from "../../../utils/AuthContext.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';


const GeneratedMealCard = ({ recipe }) => {
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [firebaseImgURL, setFirebaseImgURL] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const [isSaved, setIsSaved] = useState(recipe.isSaved || false); 
  const { user } = useAuth();
  const toggleModal = () => setIsModalOpen(!isModalOpen); // Toggle modal

  const buttonOptions = (
    <Button color="secondary" onClick={() => setSelectedMeal(null)}>
      Close
    </Button>
  );

  class ImageRequestQueue {
    constructor() {
      this.queue = [];
      this.isProcessing = false;
    }
  
    enqueue(promiseGenerator) {
      this.queue.push(promiseGenerator);
      this.processQueue();
    }
  
    async processQueue() {
      if (this.isProcessing || this.queue.length === 0) return;
      this.isProcessing = true;
      
      const currentTask = this.queue.shift(); // Get the first task
      await currentTask(); // Wait for the task to complete
  
      this.isProcessing = false;
      this.processQueue(); // Proceed to next task
    }
  }
  
  const imageRequestQueue = new ImageRequestQueue(); // Create a global queue instance
  
  const generateDalleImage = () => {
    imageRequestQueue.enqueue(async () => {
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

            // Extract the URL from the response
            const imageUrl = response.data[0].url;
            setImageURL(imageUrl);

            // Modify this to point to your proxy server
            const proxyUrl = `http://localhost:3000/proxy?url=${encodeURIComponent(imageUrl)}`;

            // Fetch the image through the proxy
            const imageResponse = await fetch(proxyUrl);
            const imageBlob = await imageResponse.blob();

            // Reference Firebase Storage correctly
            const storage = getStorage();
            const storageRef = ref(storage, `images/${recipe.name.replace(/ /g, '_')}.png`);
            const uploadTask = await uploadBytes(storageRef, imageBlob); // Upload the blob

            // Get the download URL after the upload is complete
            const downloadURL = await getDownloadURL(uploadTask.ref);
            setFirebaseImgURL(downloadURL); // Update the state with the new URL
        } catch (error) {
            console.error("Error generating or uploading image:", error);
        }
    });
};


  const saveGPTResponse = async () => {
    if (!user || !user.uid) {
      console.error("User not authenticated.");
      return;
    }
    if (isSaved) {
      console.log("Recipe already saved, skipping save.");
      return;
    }
    if (!firebaseImgURL) {
      alert("Please wait for the image to upload before saving the recipe.");
      return;
    }

    try {
      const collectionPath = `Users/${user.uid}/generatedRecipes`;
      const savedRecipe = {
        ...recipe,
        isSaved: true,
        imageUrl: firebaseImgURL
      };

      await FirestoreService.createDocument(
        collectionPath,
        savedRecipe.id,
        savedRecipe,
        "gptResponse"
      );
      setIsSaved(true);
      alert("Recipe saved successfully with image!");
    } catch (error) {
      console.error("Error saving GPT response:", error);
    }
  };
  

  useEffect(() => {
    if (!imageURL) {
      generateDalleImage();  // Only call the function if imageURL is not set
    }
  }, [imageURL]); 

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
        <Button
          className="meal-card-button"
          color="success"
          onClick={saveGPTResponse}
        >
          {isSaved ? "Saved" : "Save"}
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
