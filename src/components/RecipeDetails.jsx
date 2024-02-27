import React from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Container,
} from "reactstrap";

/**
 * Represents a component for displaying details of a recipe.
 *
 * @component
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Recipe} props.meal - The recipe object to display details for.
 * @param {boolean} props.showDetails - A flag indicating whether to show the details modal.
 * @param {Function} props.toggle - A function to toggle the visibility of the details modal.
 * @param {ReactNode} [props.buttonOptions] - Optional custom button options for the modal footer.
 *
 * @returns {ReactElement} The rendered RecipeDetails component.
 */
function RecipeDetails({ meal, showDetails, toggle, buttonOptions }) {
  // Set default buttonOptions if not provided
  if (!buttonOptions) {
    buttonOptions = (
      <Button color="secondary" onClick={toggle}>
        Close
      </Button>
    );
  }

  /**
   * Renders the RecipeDetails component.
   *
   * @returns {ReactElement} The rendered RecipeDetails component.
   */
  return (
    <Modal isOpen={showDetails} toggle={toggle}>
      <ModalHeader toggle={toggle}>{meal.name}</ModalHeader>
      <Container className="d-flex justify-content-center">
        <img src={meal.image} alt={meal.name} />
      </Container>

      <ModalBody>{String(meal.summary).replace(/<[^>]*>/g, "")}</ModalBody>
      <ModalFooter>{buttonOptions}</ModalFooter>
    </Modal>
  );
}

export default RecipeDetails;
