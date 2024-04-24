class Ingredient {
  constructor(amount, id, name, unit, isSaved = true) {
    this.amount = amount;
    this.id = id;
    this.name = name;
    this.unit = unit;
    this.isSaved = isSaved;
  }
  toString() {
    return (
      this.amount +
      ", " +
      this.id +
      ", " +
      this.name +
      ", " +
      this.unit +
      ", " +
      this.isSaved
    );
  }
}

export { Ingredient };
