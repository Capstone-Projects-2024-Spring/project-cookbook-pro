import React from "react";
import Modal from "react-modal";
import Health from "../../health/Health";

const NutritionModal = ({ isOpen, closeModal }) => {
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
        <Health />
        <br />
        <button onClick={closeModal}>Close</button>
      </div>
    </Modal>
  );
};

export default NutritionModal;
