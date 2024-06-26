class Ingredient {
  constructor(amount, id, name, unit) {
    (this.amount = amount),
      (this.id = id),
      (this.name = name),
      (this.unit = unit),
      (this.isSaved = false); // Why do we have this?
  }
  toString() {
    return this.amount + ", " + this.id + ", " + this.name + ", " + this.unit;
  }
}

export { Ingredient };
