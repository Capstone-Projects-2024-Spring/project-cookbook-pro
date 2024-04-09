import React, { useState } from "react";
import GPT from "./components/GPT";

const Recommendations = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome to the Recommendations Page</h1>
      <div style={styles.centerContent}>
        <GPT />
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    textAlign: "center",
  },
  heading: {
    fontSize: "24px",
    marginBottom: "20px",
  },
  centerContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
};

export default Recommendations;
