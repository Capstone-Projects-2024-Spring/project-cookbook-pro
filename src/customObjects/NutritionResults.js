class NutritionResults {
    constructor(nutrientValues) {
        this.calories = nutrientValues[0];
        this.protein = nutrientValues[1];
        this.carbs = nutrientValues[2];
        this.fat = nutrientValues[3];
        this.sugar = nutrientValues[4];
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
  