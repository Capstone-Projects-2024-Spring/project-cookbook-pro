import React, { useState } from "react";
import GPT from "../components/GPT";

const Recommendations = () => {
  const [toggle, setToggle] = useState(false);

  function buttonPushed() {
    setToggle((toggle) => !toggle);
  }

  return (
    <div>
      <h1>Welcome to the Recommendations Page</h1>
      <GPT /> {}
    </div>
  );
};

export default Recommendations;