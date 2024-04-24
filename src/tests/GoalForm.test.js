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

  test("should create an instance of GoalForm with default values", () => {
    const goalForm = new GoalForm();

    expect(goalForm.calories).toBe(0);
    expect(goalForm.protein).toBe(0);
    expect(goalForm.carbs).toBe(0);
    expect(goalForm.fat).toBe(0);
    expect(goalForm.sugar).toBe(0);
  });

  test("should create an instance of GoalForm with partial values", () => {
    const goalForm = new GoalForm(2000, 100);

    expect(goalForm.calories).toBe(2000);
    expect(goalForm.protein).toBe(100);
    expect(goalForm.carbs).toBe(0);
    expect(goalForm.fat).toBe(0);
    expect(goalForm.sugar).toBe(0);
  });

  test("should return a string representation of the goal form", () => {
    const goalForm = new GoalForm(2000, 100, 250, 70, 30);

    expect(goalForm.toString()).toBe("2000, 100, 250, 70, 30");
  });

  test("should return a string representation of the goal form with default values", () => {
    const goalForm = new GoalForm();

    expect(goalForm.toString()).toBe("0, 0, 0, 0, 0");
  });
});
