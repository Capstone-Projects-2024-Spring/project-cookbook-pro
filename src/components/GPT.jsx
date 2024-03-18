import React, { useState } from 'react';
import OpenAI from 'openai';

const App = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(''); // Clear any previous errors

    try {
       const openai = new OpenAI({ apiKey: apiKey});
      //Model setting
      const gptModel = "gpt-4-0125-preview";

      const userMessage = [
        { role: "system", content: "You are a recipe recommendation system that uses user preferences, recent website activity, and preferences to generate recipes that match the user's tastes without recommending food they've recently viewed or preferred. Do not ask clarifying questions, you must give the user a recipe." },
        { role: "user", content: message } // Message with user inputed message
      ];

      const completion = await openai.chat.completions.create({
        model: gptModel,
        messages: userMessage, // Fill User input
      });

      if (!completion || !completion.choices || !completion.choices.length) {
        throw new Error('Invalid response from server');
      }

      const assistantResponse = completion.choices.find(choice => choice.message.role === "assistant");

      // Check for ChatGPT error
      if (assistantResponse) {
        setResponse(assistantResponse.message.content);
      } else {
        setError('Assistant response not found');
      }
    } catch (error) {
      setError('Error communicating with the server');
      console.error('Error:', error);
    }
  };

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

export default App;
