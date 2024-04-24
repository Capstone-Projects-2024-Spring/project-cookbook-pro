import FirebaseConverter from "../firebase/FirebaseConverter";
import { GoalForm } from "../customObjects/GoalForm";

describe("FirebaseConverter", () => {
  let firebaseConverter;

  beforeEach(() => {
    firebaseConverter = new FirebaseConverter();
  });

  describe("objectConverter", () => {
    test("toFirestore converts object to Firestore format", () => {
      const object = { name: "John", age: 30 };
      const convertedObject =
        firebaseConverter.objectConverter.toFirestore(object);
      expect(convertedObject).toEqual(object);
    });

    test("toFirestore returns null for undefined or null object", () => {
      const convertedObject =
        firebaseConverter.objectConverter.toFirestore(undefined);
      expect(convertedObject).toBeNull();
    });

    test("fromFirestore converts Firestore snapshot to object", () => {
      const snapshot = {
        data: () => ({ name: "John", age: 30 }),
      };
      const objectClass = class {
        constructor(name, age) {
          this.name = name;
          this.age = age;
        }
      };
      const convertedObject = firebaseConverter.objectConverter.fromFirestore(
        snapshot,
        objectClass
      );
      expect(convertedObject).toBeInstanceOf(objectClass);
      expect(convertedObject.name).toBe("John");
      expect(convertedObject.age).toBe(30);
    });
  });

  describe("convertArray", () => {
    test("converts array using the provided converter", () => {
      const array = [{ name: "John" }, { name: "Jane" }];
      const converter = {
        toFirestore: (item) => ({ name: item.name.toUpperCase() }),
      };
      const convertedArray = firebaseConverter.convertArray(array, converter);
      expect(convertedArray).toEqual([{ name: "JOHN" }, { name: "JANE" }]);
    });
  });

  describe("recipeConverter", () => {
    test("toFirestore converts Recipe to Firestore format", () => {
      const recipe = new Recipe(
        "Italian",
        "Main",
        "recipe1",
        "image.jpg",
        [{ name: "Ingredient 1", amount: 1, unit: "cup" }],
        "Instructions",
        "Recipe Name",
        4,
        "Summary",
        true
      );
      const convertedRecipe =
        firebaseConverter.recipeConverter.toFirestore(recipe);
      expect(convertedRecipe).toEqual({
        cuisine: "Italian",
        dishType: "Main",
        id: "recipe1",
        image: "image.jpg",
        ingredients: [{ name: "Ingredient 1", amount: 1, unit: "cup" }],
        instructions: "Instructions",
        name: "Recipe Name",
        servings: 4,
        summary: "Summary",
        isSaved: true,
      });
    });

    test("toFirestore returns null for undefined or null Recipe", () => {
      const convertedRecipe =
        firebaseConverter.recipeConverter.toFirestore(undefined);
      expect(convertedRecipe).toBeNull();
    });

    test("fromFirestore converts Firestore snapshot to Recipe", () => {
      const snapshot = {
        data: () => ({
          cuisine: "Italian",
          dishType: "Main",
          id: "recipe1",
          image: "image.jpg",
          ingredients: [{ name: "Ingredient 1", amount: 1, unit: "cup" }],
          instructions: "Instructions",
          name: "Recipe Name",
          servings: 4,
          summary: "Summary",
          isSaved: true,
        }),
      };
      const convertedRecipe =
        firebaseConverter.recipeConverter.fromFirestore(snapshot);
      expect(convertedRecipe).toBeInstanceOf(Recipe);
      expect(convertedRecipe.cuisine).toBe("Italian");
      expect(convertedRecipe.dishType).toBe("Main");
      expect(convertedRecipe.id).toBe("recipe1");
      expect(convertedRecipe.image).toBe("image.jpg");
      expect(convertedRecipe.ingredients).toEqual([
        { name: "Ingredient 1", amount: 1, unit: "cup" },
      ]);
      expect(convertedRecipe.instructions).toBe("Instructions");
      expect(convertedRecipe.name).toBe("Recipe Name");
      expect(convertedRecipe.servings).toBe(4);
      expect(convertedRecipe.summary).toBe("Summary");
      expect(convertedRecipe.isSaved).toBe(true);
    });
  });

  describe("orderConverter", () => {
    test("fromFirestore handles missing ingredients in snapshot data", () => {
      const snapshot = {
        data: () => ({
          recipeNames: ["Recipe 1", "Recipe 2"],
          ingredients: undefined,
        }),
      };
      const convertedOrder =
        firebaseConverter.orderConverter.fromFirestore(snapshot);
      expect(convertedOrder).toEqual({
        recipeNames: ["Recipe 1", "Recipe 2"],
        ingredients: [],
      });
    });

    test("toFirestore converts order to Firestore format", () => {
      const order = {
        recipeNames: ["Recipe 1", "Recipe 2"],
        ingredients: [
          { name: "Ingredient 1", amount: 1, unit: "cup" },
          { name: "Ingredient 2", amount: 2, unit: "tbsp" },
        ],
      };
      const convertedOrder =
        firebaseConverter.orderConverter.toFirestore(order);
      expect(convertedOrder).toEqual({
        recipeNames: ["Recipe 1", "Recipe 2"],
        ingredients: [
          { name: "Ingredient 1", amount: 1, unit: "cup" },
          { name: "Ingredient 2", amount: 2, unit: "tbsp" },
        ],
      });
    });

    test("toFirestore returns null for undefined or null order", () => {
      const convertedOrder =
        firebaseConverter.orderConverter.toFirestore(undefined);
      expect(convertedOrder).toBeNull();
    });

    test("fromFirestore converts Firestore snapshot to order", () => {
      const snapshot = {
        data: () => ({
          recipeNames: ["Recipe 1", "Recipe 2"],
          ingredients: [
            { name: "Ingredient 1", amount: 1, unit: "cup" },
            { name: "Ingredient 2", amount: 2, unit: "tbsp" },
          ],
        }),
      };
      const convertedOrder =
        firebaseConverter.orderConverter.fromFirestore(snapshot);
      expect(convertedOrder).toEqual({
        recipeNames: ["Recipe 1", "Recipe 2"],
        ingredients: [
          { name: "Ingredient 1", amount: 1, unit: "cup" },
          { name: "Ingredient 2", amount: 2, unit: "tbsp" },
        ],
      });
    });
  });

  describe("gptResponseConverter", () => {
    test("toFirestore converts GPT response to Firestore format", () => {
      const gptResponse = {
        userMessage: "User message",
        assistantResponse: "Assistant response",
      };
      const convertedGptResponse =
        firebaseConverter.gptResponseConverter.toFirestore(gptResponse);
      expect(convertedGptResponse).toEqual({
        userMessage: "User message",
        assistantResponse: "Assistant response",
      });
    });

    test("toFirestore returns null for undefined or null GPT response", () => {
      const convertedGptResponse =
        firebaseConverter.gptResponseConverter.toFirestore(undefined);
      expect(convertedGptResponse).toBeNull();
    });

    test("fromFirestore converts Firestore snapshot to GPT response", () => {
      const snapshot = {
        data: () => ({
          userMessage: "User message",
          assistantResponse: "Assistant response",
        }),
      };
      const convertedGptResponse =
        firebaseConverter.gptResponseConverter.fromFirestore(snapshot);
      expect(convertedGptResponse).toEqual({
        userMessage: "User message",
        assistantResponse: "Assistant response",
      });
    });
  });

  describe("goalsResponseConverter", () => {
    test("toFirestore converts GoalForm to Firestore format", () => {
      const goalsResponse = new GoalForm(2000, 100, 200, 50, 30);
      const convertedGoalsResponse =
        firebaseConverter.goalsResponseConverter.toFirestore(goalsResponse);
      expect(convertedGoalsResponse).toEqual({
        calories: 2000,
        protein: 100,
        carbs: 200,
        fat: 50,
        sugar: 30,
      });
    });

    test("toFirestore returns null for undefined or null GoalForm", () => {
      const convertedGoalsResponse =
        firebaseConverter.goalsResponseConverter.toFirestore(undefined);
      expect(convertedGoalsResponse).toBeNull();
    });

    test("fromFirestore converts Firestore snapshot to GoalForm", () => {
      const snapshot = {
        data: () => ({
          calories: 2000,
          protein: 100,
          carbs: 200,
          fat: 50,
          sugar: 30,
        }),
      };
      const convertedGoalsResponse =
        firebaseConverter.goalsResponseConverter.fromFirestore(snapshot);
      expect(convertedGoalsResponse).toBeInstanceOf(GoalForm);
      expect(convertedGoalsResponse.calories).toBe(2000);
      expect(convertedGoalsResponse.protein).toBe(100);
      expect(convertedGoalsResponse.carbs).toBe(200);
      expect(convertedGoalsResponse.fat).toBe(50);
      expect(convertedGoalsResponse.sugar).toBe(30);
    });
  });

  describe("planConverter", () => {
    test("toFirestore converts Plan to Firestore format", () => {
      const plan = new Plan("2023-06-01", [
        {
          name: "Meal 1",
          id: "meal1",
          autoAddToCart: true,
          addToCartTime: "09:00",
        },
        {
          name: "Meal 2",
          id: "meal2",
          autoAddToCart: false,
          addToCartTime: "13:00",
        },
      ]);
      const convertedPlan = firebaseConverter.planConverter.toFirestore(plan);
      expect(convertedPlan).toEqual({
        date: "2023-06-01",
        meals: [
          {
            name: "Meal 1",
            id: "meal1",
            autoAddToCart: true,
            addToCartTime: "09:00",
            mealNumber: 1,
          },
          {
            name: "Meal 2",
            id: "meal2",
            autoAddToCart: false,
            addToCartTime: "13:00",
            mealNumber: 2,
          },
        ],
      });
    });

    test("fromFirestore handles missing meals in snapshot data", () => {
      const snapshot = {
        data: () => ({
          date: "2023-06-01",
          meals: undefined,
        }),
      };
      const convertedPlan =
        firebaseConverter.planConverter.fromFirestore(snapshot);
      expect(convertedPlan.meals).toEqual([]);
    });

    test("toFirestore returns null for undefined or null Plan", () => {
      const convertedPlan =
        firebaseConverter.planConverter.toFirestore(undefined);
      expect(convertedPlan).toBeNull();
    });

    test("fromFirestore converts Firestore snapshot to Plan", () => {
      const snapshot = {
        data: () => ({
          date: "2023-06-01",
          meals: [
            {
              name: "Meal 1",
              id: "meal1",
              autoAddToCart: true,
              addToCartTime: "09:00",
              mealNumber: 1,
            },
            {
              name: "Meal 2",
              id: "meal2",
              autoAddToCart: false,
              addToCartTime: "13:00",
              mealNumber: 2,
            },
          ],
        }),
      };
      const convertedPlan =
        firebaseConverter.planConverter.fromFirestore(snapshot);
      expect(convertedPlan).toBeInstanceOf(Plan);
      expect(convertedPlan.date).toBe("2023-06-01");
      expect(convertedPlan.meals).toEqual([
        {
          name: "Meal 1",
          id: "meal1",
          autoAddToCart: true,
          addToCartTime: "09:00",
          mealNumber: 1,
        },
        {
          name: "Meal 2",
          id: "meal2",
          autoAddToCart: false,
          addToCartTime: "13:00",
          mealNumber: 2,
        },
      ]);
    });
  });
});
