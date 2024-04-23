import { GoalForm } from "../customObjects/GoalForm";

describe("GoalForm", () => {
  test("should create an instance of GoalForm with correct properties", () => {
    const goalForm = new GoalForm(2000, 100, 250, 70, 30);

    expect(goalForm.calories).toBe(2000);
    expect(goalForm.protein).toBe(100);
    expect(goalForm.carbs).toBe(250);
    expect(goalForm.fat).toBe(70);
    expect(goalForm.sugar).toBe(30);
  });

  test("should return a string representation of the goal form", () => {
    const goalForm = new GoalForm(2000, 100, 250, 70, 30);

    expect(goalForm.toString()).toBe("2000, 100, 250, 70, 30");
  });
});
