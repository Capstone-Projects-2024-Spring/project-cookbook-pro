import React, { useState } from "react";

const Home = () => {
  const [toggle, setToggle] = useState(false);
  function buttonPushed() {
    setToggle((toggle) => !toggle);
  }
 
  return (
    <div>
      <h1>Welcome to CookBook Pro</h1>
    </div>
  );
};

export default Home;
