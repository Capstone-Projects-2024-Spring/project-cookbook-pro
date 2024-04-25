class NutritionResults {
    constructor(calories, protein, carbs, fat, sugar) {
      (this.calories = calories),
        (this.protein = protein),
        (this.carbs = carbs),
        (this.fat = fat),
        (this.sugar = sugar);
    }
    toString() {
      return (
        this.calories +
        ", " +
        this.protein +
        ", " +
        this.carbs +
        ", " +
        this.fat +
        ", " +
        this.sugar
      );
    }
  }
  
  export { NutritionResults };
  