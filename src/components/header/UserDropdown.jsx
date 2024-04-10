import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import { Dropdown } from "react-bootstrap";
import { useAuth } from "../../utils/AuthContext";

function UserDropdown() {
  const { user, logoutUser } = useAuth();

  return (
    <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        {user.displayName}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item as={Link} to="/order-history">
          Order History
        </Dropdown.Item>
        <Dropdown.Item as={Link} to="/generated-recipes">
          Generated Recipes
        </Dropdown.Item>
        <Dropdown.Item onClick={logoutUser}>Logout</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default UserDropdown;
