import { Plan } from "../customObjects/Plan";

describe("Plan", () => {
  test("should create an instance of Plan with correct properties", () => {
    const meals = [{ name: "Meal 1" }, { name: "Meal 2" }, { name: "Meal 3" }];
    const plan = new Plan("2023-06-06", meals);

    expect(plan.date).toBe("2023-06-06");
    expect(plan.meals).toEqual(meals);
  });

  test("should return a string representation of the plan", () => {
    const meals = [{ name: "Meal 1" }, { name: "Meal 2" }, { name: "Meal 3" }];
    const plan = new Plan("2023-06-06", meals);

    expect(plan.toString()).toBe("2023-06-06, Meal 1, Meal 2, Meal 3");
  });
});
