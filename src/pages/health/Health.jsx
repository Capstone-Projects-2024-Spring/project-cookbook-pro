
import React, { useState } from "react";
import { Row, Col, Container, Spinner } from "reactstrap";
import MacroGoalForm from "../components/MacroGoalForm";

const HealthPage = () => {


  return (
    <Container>
      <h1 className="d-flex justify-content-center">Health Page</h1>
      <Row>
        <Container className="d-flex justify-content-center">
          <MacroGoalForm/>
          <br></br>
        </Container>
      </Row>
      </Container>

  );
};

export default HealthPage;