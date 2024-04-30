import React, { useState, useEffect } from "react";
import Order from "./components/Order";
import { useAuth } from "../../utils/AuthContext";
import FirestoreService from "../../firebase/FirebaseService";
import "./order-history.css";

const OrderHistory = () => {
  const { user } = useAuth();
  const [orderHistoryDocuments, setOrderHistoryDocuments] = useState([]);

  const fetchOrderHistory = async () => {
    const collectionPath = `Users/${user.uid}/Orders`;
    const dataType = "orderHistory";
    try {
      const documents = await FirestoreService.getAllDocuments(
        collectionPath,
        dataType
      );
      setOrderHistoryDocuments(documents);
    } catch (error) {
      console.error("Error fetching order history:", error);
    }
  };

  const sortedOrders = orderHistoryDocuments.sort((a, b) => {
    // Assuming orderId is a string, use localeCompare for string comparison
    return b.id.localeCompare(a.id);
  });

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  return (
    <div className="order-history-container">
      <h1>Order History</h1>
      {sortedOrders.map((order, index) => (
        <Order
          key={index}
          recipeNames={order.data.recipeNames}
          ingredients={order.data.ingredients}
          orderId={order.id}
        />
      ))}
    </div>
  );
};

export default OrderHistory;
