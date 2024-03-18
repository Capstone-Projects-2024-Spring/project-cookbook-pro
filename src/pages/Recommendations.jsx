import React, { useState } from "react";

const Recommendations = () => {
  const [toggle, setToggle] = useState(false);

  function buttonPushed() {
    setToggle((toggle) => !toggle);
  }

  return (
    <div>
      <h1>Welcome to the Recommendations Page</h1>
    </div>
  );
};

export default Recommendations;