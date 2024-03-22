
import React, { useState } from "react";
import { Row, Col, Container, Spinner } from "reactstrap";
import MacroGoalForm from "../components/MacroGoalForm";

const HealthPage = () => {

 
  return (
    <Container className="health-page">
      <h1 className="d-flex justify-content-center">Health Page</h1>
      <Row>
        <MacroGoalForm/>
      </Row>
      
      </Container>
  );
};

export default HealthPage;