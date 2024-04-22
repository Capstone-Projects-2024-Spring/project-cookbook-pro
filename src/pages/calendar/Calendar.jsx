import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import Modal from "react-modal";
import { eachDayOfInterval, startOfDay, isSameDay } from "date-fns";
import MealForm from "./components/MealForm.jsx";
import "./calendarStyle.css";
import "react-calendar/dist/Calendar.css";
import FirestoreService from "../../firebase/FirebaseService.js";
import FirestoreListener from "../../firebase/FirestoreListener.js";
import { useAuth } from "../../utils/AuthContext.js";
import NutritionModal from "./components/NutritionModal.jsx";

const MyCalendar = () => {
  //firebase auth
  const { user } = useAuth();
  //state variables, initial value of date and selectedDay are both current date
  const [date, setDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date());
  //for selecting a date range
  const [selectedDates, setSelectedDates] = useState([]);
  //empty array of plans
  const [plans, setPlans] = useState([]);
  //modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  //for displaying saved plans from firebase
  const [isNutritionModalOpen, setIsNutritionModalOpen] = useState(false);
  const openNutritionModal = () => {
    setIsNutritionModalOpen(true);
  };
  const closeNutritionModal = () => {
    setIsNutritionModalOpen(false);
  };
  const firestoreListener = new FirestoreListener();

  useEffect(() => {
    const userPlansPath = `Users/${user.uid}/Plans`;

    const unsubscribeFromPlans = firestoreListener.subscribeToCollection(
      userPlansPath,
      (docs) => {
        const plans = docs;
        setPlans(plans);
      }
    );

    return unsubscribeFromPlans;
  }, [user.uid]);

  //onChange and onClickDay update date and selectedDay
  const onChange = (date) => {
    setDate(date);
  };

  //selecting days/date range
  const onClickDay = (value, event) => {
    //if shift is held down and a date is clicked
    if (event.shiftKey && selectedDay) {
      //take the range from the selected day to the shift-clicked day
      const range = eachDayOfInterval({
        start: startOfDay(selectedDay),
        end: startOfDay(value),
      });
      setSelectedDates(range);
      //log the date range (remove later)
      console.log(range.map((date) => date.toISOString()));
    } else {
      //otherwise just update selected with the clicked day
      setSelectedDay(value);
      //and then reset the selected dates so the highlights go away
      setSelectedDates([]);
    }
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
        "plan"
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
        "plan"
      ).catch((error) => console.error("Error creating plan: ", error));
    }
  };

  const removePlan = (planDate, mealIndex) => {
    //find plan according to date
    const planToUpdate = plans.find((plan) => plan.date === planDate);
    //if the plan exists, remove the selected meal
    if (planToUpdate) {
      const updatedMeals = planToUpdate.meals.filter(
        (meal, index) => index !== mealIndex
      );
      //updating plan with new meal list
      const updatedPlan = { ...planToUpdate, meals: updatedMeals };
      //updating plan in the local state
      setPlans(
        plans.map((plan) => (plan.date === planDate ? updatedPlan : plan))
      );
      //updating firestore
      FirestoreService.updateDocument(
        `Users/${user.uid}/Plans/`,
        planDate,
        updatedPlan
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

  return (
    <div className="calendar-container">
      <Calendar
        onChange={onChange}
        value={date}
        onClickDay={onClickDay}
        tileContent={({ date, view }) => {
          const dayPlans = plans.filter(
            (plan) => plan.date === date.toISOString().split("T")[0]
          );
          //finding out how many meals are planned for that day
          const totalMeals = dayPlans.reduce(
            (sum, plan) => sum + plan.meals.length,
            0
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
        tileClassName={({ date, view }) => {
          //if the date is part of the selected date range, add a class to highlight it
          if (
            view === "month" &&
            selectedDates.some((selectedDate) => isSameDay(selectedDate, date))
          ) {
            return "selected-dates";
          }
          //splits the strings and compares only the dates (so that current day isn't greyed)
          if (
            date.toISOString().split("T")[0] <
            new Date().toISOString().split("T")[0]
          ) {
            return "past-date";
          }
        }}
      />
      <div id="calendar-sidebar">
        <div id="nutrition-launcher">
          <button id="nutrition-button" onClick={openNutritionModal}>
            Generate Nutrition Report
          </button>
        </div>
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
              (plan) => plan.date === selectedDay.toISOString().split("T")[0]
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
              ))
            )}
          <button className="add-meal-btn" onClick={openModal}>
            Add Meal
          </button>
        </div>
      </div>
      <NutritionModal
        isOpen={isNutritionModalOpen}
        closeModal={closeNutritionModal}
      />
    </div>
  );
};

export default MyCalendar;
