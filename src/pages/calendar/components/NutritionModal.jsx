import React from "react";
import Modal from "react-modal";
import Health from "../../health/Health";
import DisplayRecipeMacros from "../../health/components/DisplayRecipeMacros";
import { Col } from "react-bootstrap";
import "../nutritionModalStyle.css"

const NutritionModal = ({ isOpen, closeModal, recipes }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Nutrition Report"
      id="nutrition-modal"
      overlayClassName="nutrition-modal-overlay"
      ariaHideApp={false}
    >
      <div className="nutrition-modal-content">
        <h2>Nutrition Report</h2>
        {/* Add your nutrition report content here */}
        <Col id="modal-goals-column">
          <Health recipes={recipes}/>
          <br />
        </Col>

        {/* <Col id="modal-recipetotals-column">
          <DisplayRecipeMacros/>
          <br />
        </Col> */}

        <Col id="modal-visual-column">
          Visuals
          <br />
        </Col>

        <br />
        <button onClick={closeModal}>Close</button>
      </div>
    </Modal>
  );
};

export default NutritionModal;
