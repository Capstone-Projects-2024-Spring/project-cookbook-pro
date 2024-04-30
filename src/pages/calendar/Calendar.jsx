import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import Modal from "react-modal";
import { eachDayOfInterval, startOfDay, isSameDay, max, min } from "date-fns";
import { Button } from "reactstrap";
import MealForm from "./components/MealForm.jsx";
import "./calendarStyle.css";
import "react-calendar/dist/Calendar.css";
import FirestoreService from "../../firebase/FirebaseService.js";
import FirestoreListener from "../../firebase/FirestoreListener.js";
import { useAuth } from "../../utils/AuthContext.js";
import NutritionModal from "./components/NutritionModal.jsx";
import RecipeDetails from "../../components/RecipeDetails.jsx";
import Cart from "../../components/cart/Cart.jsx";

const MyCalendar = () => {
  //firebase auth
  const { user } = useAuth();
  //state variables, initial value of date and selectedDay are both current date
  const [date, setDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date());
  //for selecting a date range
  const [selectedDates, setSelectedDates] = useState([]);
  //for selecting a specific meal and seeing details
  const [selectedMeal, setSelectedMeal] = useState(null);
  //storing cart items to be ordered
  const [cartItems, setCartItems] = useState([]);
  //empty array of plans
  const [plans, setPlans] = useState([]);
  //meal form modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  //order modal state
  const [isOrderModalOpen, setOrderModalOpen] = useState(false);
  //nutritional modal state
  const [isNutritionModalOpen, setIsNutritionModalOpen] = useState(false);
  //nutritional modal recipes state
  const [nutritionRecipes, setnutritionRecipes] = useState([]);
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
        start: min([startOfDay(selectedDay), startOfDay(value)]),
        end: max([startOfDay(selectedDay), startOfDay(value)]),
      });

      setSelectedDates(range);
    } else {
      //otherwise just update selected with the clicked day
      setSelectedDay(value);
      //and then reset the selected dates so the highlights go away
      setSelectedDates([]);
    }
  };

  //adding a plan
  const addPlan = (recipe, autoAddToCart, addToCartTime) => {
    const planDate = selectedDay.toISOString().split("T")[0];
    //checking for existing plans to avoid overwrites
    const existingPlan = plans.find((plan) => plan.date === planDate);
    //meal object
    const meal = {
      recipe: recipe,
      autoAddToCart: autoAddToCart,
      addToCartTime: addToCartTime,
    };
    //if the plan exists, add the meal to the existing plan
    if (existingPlan) {
      existingPlan.meals.push(meal);
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
        meals: [meal],
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

  //getting recipes for ordering/nutrition modals
  const getRecipes = () =>
    (selectedDates.length > 0 ? selectedDates : [selectedDay]).flatMap(
      (date) =>
        plans
          .filter((plan) => plan.date === date.toISOString().split("T")[0])
          .flatMap((plan) => plan.meals)
          .map((meal) => meal.recipe) //get the recipe of each meal
    );

  const renderPlan = (date, plan, mealIndex) => (
    //for each plan entry, create a div displaying the meal's name
    <div
      key={`${date.toISOString()}-${mealIndex}`}
      className="meal-tile rounded"
    >
      <h6>{plan.meals[mealIndex].recipe.name}</h6>
      <button
        type="button"
        className="sm-cal-btn"
        onClick={() => setSelectedMeal(plan.meals[mealIndex])}
      >
        Details
      </button>
      <button
        type="button"
        className="sm-cal-btn"
        onClick={() => removePlan(plan.date, mealIndex)}
      >
        Remove
      </button>
    </div>
  );

  const buttonOptions = () => (
    <>
      <Button
        color="primary"
        onClick={() => {
          unsaveRecipeFromCurrentUser(
            `Users/${user.uid}/SavedRecipes/`,
            String(selectedMeal.id),
            "recipe"
          );
          //close the modal and remove the recipe
          setSelectedMeal(null);
        }}
      >
        Unsave recipe
      </Button>
      <Button color="secondary" onClick={() => setSelectedMeal(null)}>
        Cancel
      </Button>
    </>
  );

  const orderMeals = () => {
    setOrderModalOpen(true);
    //get all the recipes for the selected date or date range
    const recipes = getRecipes();
    //set cartItems to the recipes
    setCartItems(recipes);
  };

  const formatDate = (date) =>
    date.toLocaleString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });

  //opening/closing modal (meal form)
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  //opening the nutrition modal and passing in recipes
  const generateNutrition = () => {
    //get all the recipes for the selected date or date range
    const recipes = getRecipes();
    //set nutritionModalRecipes to the recipes
    setnutritionRecipes(recipes);
    setIsNutritionModalOpen(true);
  };

  const closeNutritionModal = () => {
    setIsNutritionModalOpen(false);
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
        <span className="date-display">
          {selectedDates.length > 0 //if there's a date range, display the first and last dates
            ? `${formatDate(selectedDates[0])} - ${formatDate(
                selectedDates[selectedDates.length - 1]
              )}`
            : formatDate(selectedDay)}
        </span>{" "}
        <div id="nutrition-launcher">
          <button id="nutrition-button" onClick={generateNutrition}>
            Generate Nutrition Report
          </button>
        </div>
        <div className="selected-day">
          <Modal
            ariaHideApp={false}
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            style={{
              content: {
                width: "50%",
                margin: "0 auto",
              },
            }}
          >
            <MealForm closeModal={closeModal} addPlan={addPlan} />
          </Modal>
          <button className="lg-cal-btn" onClick={openModal}>
            Add Meal
          </button>
          {
            //only renders the order meals button if there are meals to order
            (selectedDates.length > 0 ? selectedDates : [selectedDay]).some(
              (date) =>
                plans.some(
                  (plan) =>
                    plan.date === date.toISOString().split("T")[0] &&
                    plan.meals.length > 0
                )
            ) && (
              <button className="lg-cal-btn order" onClick={orderMeals}>
                Order Meals
              </button>
            )
          }
          <br />
          <div className="selected-meals-container">
            {
              //if there are selected dates in array, display the meals of all of them
              //otherwise, display the meals of the selected day
              (selectedDates.length > 0 ? selectedDates : [selectedDay]).map(
                (date) =>
                  plans
                    .filter(
                      (plan) => plan.date === date.toISOString().split("T")[0]
                    )
                    .map((plan, index) =>
                      plan.meals.map((meal, mealIndex) =>
                        renderPlan(date, plan, mealIndex)
                      )
                    )
              )
            }
          </div>

          {selectedMeal && (
            <RecipeDetails
              meal={selectedMeal.recipe}
              isOpen={selectedMeal !== null}
              toggle={() => setSelectedMeal(null)}
              buttonOptions={buttonOptions}
            />
          )}
          {cartItems.length > 0 && (
            <Cart
              modalOpen={isOrderModalOpen}
              setModalOpen={setOrderModalOpen}
              cartItems={cartItems}
              type="calendar"
              removeFromCart={(meal) =>
                setCartItems(cartItems.filter((item) => item !== meal))
              }
            />
          )}
        </div>
      </div>
      <NutritionModal
        isOpen={isNutritionModalOpen}
        closeModal={closeNutritionModal}
        recipes={nutritionRecipes}
        selectedDates={selectedDates.length > 0 ? selectedDates.length : 1}
      />
    </div>
  );
};

export default MyCalendar;
