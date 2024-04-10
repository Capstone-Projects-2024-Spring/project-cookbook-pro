import React, { useState, useEffect } from 'react';
import { useAuth } from '../../utils/AuthContext';
import FirestoreService from '../../firebase/FirebaseService';

const GeneratedRecipes = () => {
  const { user } = useAuth();
  const [recipesText, setRecipesText] = useState([]);

  useEffect(() => {
    const fetchGeneratedRecipes = async () => {
        const collectionPath = `Users/${user.uid}/generatedRecipes`;
        try {
          const querySnapshot = await FirestoreService.getAllDocuments(collectionPath);
          const documents = querySnapshot.docs.map(doc => doc.data());
          
          if (documents.length > 0) {
            // Map each document to its JSON string representation
            const recipes = documents.map(doc => JSON.stringify(doc, null, 2)); // Pretty print each JSON document
            setRecipesText(recipes);
          } else {
            setRecipesText(['No recipes found.']);
          }
        } catch (error) {
          console.error('Error fetching recipes:', error);
          setRecipesText(['Failed to load recipes.']);
        }
      };

    fetchGeneratedRecipes();
  }, [user.uid]);

  return (
    <div>
      <h1>Generated Recipes</h1>
      {recipesText.map((text, index) => (
        <pre key={index} style={{ background: '#f0f0f0', padding: '10px', borderRadius: '5px', marginBottom: '10px' }}>
          {text}
        </pre> // Using <pre> for preformatted text
      ))}
    </div>
  );
};

export default GeneratedRecipes;
