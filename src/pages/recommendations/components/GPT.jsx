import React, { useState, useEffect } from "react";
import OpenAI from "openai";
import FirestoreService from "../../../firebase/FirebaseService";
import { useAuth } from "../../../utils/AuthContext.js";
const GPT = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [recipeNames, setRecipeNames] = useState([]);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  async function handleSubmit(e) {
    e.preventDefault();

    // Clear any previous errors and responses
    setError("");
    setResponse("");

    if (!user || !user.uid) {
      setError("User not authenticated.");
      return;
    }

    // Fetch saved recipes
    const getSavedRecipes = async () => {
      const collectionPath = `Users/${user.uid}/SavedRecipes`;
      try {
        const allDocuments = await FirestoreService.getAllDocuments(collectionPath, "recipes");
        const names = allDocuments.map((doc) => doc.data.name);
        return names; // Return the names for use below
      } catch (error) {
        console.error("Error fetching saved recipes:", error);
        throw new Error("Failed to fetch saved recipes.");
      }
    };

    try {
      const recipeNames = await getSavedRecipes(); // Ensure this completes before moving on
      setRecipeNames(recipeNames); // Update the state with the names


      // Prepare for OpenAI request
      const openai = new OpenAI({
        apiKey: process.env.REACT_APP_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
      });
      const gptModel = "gpt-4-0125-preview";
      const recipeListString = recipeNames.join(", ");
      const systemMessageContent = `You are a recipe recommendation system... Previously saved recipes include: ${recipeListString}.`;
      console.log(systemMessageContent); // Optional: logging for debug

      const userMessage = [
        { role: "system", content: systemMessageContent },
        { role: "user", content: message }
      ];

      const completion = await openai.chat.completions.create({
        model: gptModel,
        messages: userMessage,
      });

      // Process and handle OpenAI response
      const assistantResponse = completion.choices?.find(choice => choice.message.role === "assistant");
      if (assistantResponse) {
        setResponse(assistantResponse.message.content);
        await FirestoreService.createDocument(
          collectionPath,
          documentId,
          gptResponse,
          "gptResponse"
        );
      } else {
        throw new Error("Assistant response not found");
      }
    } catch (error) {
      setError("Error: " + error.message);
      console.error("Error:", error);
    }
  }
  
  return (
    <div>
      <h1>ChatGPT</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Message:
          <input type="text" value={message} onChange={handleChange} />
        </label>
        <button type="submit">Send</button>
      </form>
      {error && <div>Error: {error}</div>}
      <div>
        <h2>Response:</h2>
        <pre>{response}</pre>
      </div>
    </div>
  );
};

export default GPT;
