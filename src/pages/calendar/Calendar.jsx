import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import Modal from "react-modal";
import MealForm from "./components/MealForm.jsx";
import "../../css/calendarStyle.css";
import "react-calendar/dist/Calendar.css";
import FirestoreService from "../../firebase/FirebaseService.js";
import FirestoreListener from "../../firebase/FirestoreListener.js";
import { useAuth } from "../../utils/AuthContext.js";

const MyCalendar = () => {
  //firebase auth
  const { user } = useAuth();
  //state variables, initial value of date and selectedDay are both current date
  const [date, setDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date());
  //empty array of plans
  const [plans, setPlans] = useState([]);
  //modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  //for displaying saved plans from firebase
  const firestoreListener = new FirestoreListener();
  const [isDateSelectorVisible, setDateSelectorVisible] = useState(false);


  useEffect(() => {
    const userPlansPath = `Users/${user.uid}/Plans`;

    const unsubscribeFromPlans = firestoreListener.subscribeToCollection(
      userPlansPath,
      (docs) => {
        const plans = docs;
        setPlans(plans);
      },
    );

    return unsubscribeFromPlans;
  }, [user.uid]);

  //onChange and onClickDay update date and selectedDay
  const onChange = (date) => {
    setDate(date);
  };
  const onClickDay = (date) => {
    setSelectedDay(date);
  };

  //adding a plan
  const addPlan = (name, id, autoAddToCart, addToCartTime) => {
    const planDate = selectedDay.toISOString().split("T")[0];
    //checking for existing plans to avoid overwrites
    const existingPlan = plans.find((plan) => plan.date === planDate);
    //if the plan exists, add the meal to the existing plan
    if (existingPlan) {
      existingPlan.meals.push({
        name: name,
        id: id,
        autoAddToCart: autoAddToCart,
        addToCartTime: addToCartTime,
      });

      FirestoreService.updateDocument(
        `Users/${user.uid}/Plans/`,
        planDate,
        existingPlan,
        "plan",
      ).catch((error) => console.error("Error updating plan: ", error));
    }
    //if there's no existing plan, create a new plan
    else {
      const newPlan = {
        date: planDate,
        meals: [
          {
            name: name,
            id: id,
            autoAddToCart: autoAddToCart,
            addToCartTime: addToCartTime,
          },
        ],
      };
      setPlans([...plans, newPlan]);

      FirestoreService.createDocument(
        `Users/${user.uid}/Plans/`,
        planDate,
        newPlan,
        "plan",
      ).catch((error) => console.error("Error creating plan: ", error));
    }
  };

  const removePlan = (planDate, mealIndex) => {
    //find plan according to date
    const planToUpdate = plans.find((plan) => plan.date === planDate);
    //if the plan exists, remove the selected meal
    if (planToUpdate) {
      const updatedMeals = planToUpdate.meals.filter(
        (meal, index) => index !== mealIndex,
      );
      //updating plan with new meal list
      const updatedPlan = { ...planToUpdate, meals: updatedMeals };
      //updating plan in the local state
      setPlans(
        plans.map((plan) => (plan.date === planDate ? updatedPlan : plan)),
      );
      //updating firestore
      FirestoreService.updateDocument(
        `Users/${user.uid}/Plans/`,
        planDate,
        updatedPlan,
      ).catch((error) => console.error("Error removing meal: ", error));
    }
  };

  //opening/closing modal (meal form)
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCheckboxClick = () => {
    setDateSelectorVisible(!isDateSelectorVisible);
  };

  return (
    <div className="calendar-container">
      <Calendar
        onChange={onChange}
        value={date}
        onClickDay={onClickDay}
        tileContent={({ date, view }) => {
          const dayPlans = plans.filter(
            (plan) => plan.date === date.toISOString().split("T")[0],
          );
          //finding out how many meals are planned for that day
          const totalMeals = dayPlans.reduce(
            (sum, plan) => sum + plan.meals.length,
            0,
          );
          return (
            <div>
              <p>
                {totalMeals} {totalMeals === 1 ? "meal" : "meals"}
              </p>
            </div>
          );
        }}
        //greying out past dates
        tileClassName={({ date }) => {
          //splits the strings and compares only the dates (so that current day isn't greyed)
          if (
            date.toISOString().split("T")[0] <
            new Date().toISOString().split("T")[0]
          ) {
            return "past-date";
          }
        }}
      />
      <div className="selected-day">
        <span className="date-display">
          {selectedDay.toLocaleString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric",
          })}
        </span>{" "}
        <br />
        <Modal
          ariaHideApp={false}
          isOpen={isModalOpen}
          onRequestClose={closeModal}
        >
          <MealForm closeModal={closeModal} addPlan={addPlan} />
        </Modal>
        <br />
        {plans
          //filtering plans by selected day to display them
          .filter(
            (plan) => plan.date === selectedDay.toISOString().split("T")[0],
          )
          .map((plan, index) =>
            plan.meals.map((meal, mealIndex) => (
              //for each entry, create a div displaying the meal's name
              <div key={mealIndex} className="meal-tile rounded">
                <h6>{meal.name}</h6>
                <button
                  type="button"
                  className="rm-meal-btn"
                  onClick={() => removePlan(plan.date, mealIndex)}
                >
                  Remove
                </button>
              </div>
            )),
          )}
        <button className="add-meal-btn" onClick={openModal}>
          Add Meal
        </button>
        <label className="add-order-btn">
          Enable Order {' '}
          <input type="checkbox" onClick={handleCheckboxClick} />
        </label>
        {isDateSelectorVisible && (
          <>
            <input type="date" min={new Date().toISOString().split('T')[0]} />
            <button>Set Order</button>
          </>
        )}
      </div>
    </div>
  );
};

export default MyCalendar;
