var Amount = function(quantity, unit, ingredientName) {
  this.quantityAsString = quantity;
  this.unit = unit;
  this.ingredientName = ingredientName;
  
  this.quantity = function() {
    if (this.quantityAsString === "a" || this.quantityAsString === "an") {
      return 1;
    }
    if (this.quantityAsString.includes('/')) {
      var numeratorAndDenominator = this.quantityAsString.split('/').map(function(part) { return parseInt(part); });
      return numeratorAndDenominator[0] / numeratorAndDenominator[1];
    }
    var parsedFloat = parseFloat(this.quantityAsString)
    if (parsedFloat) {
      return parsedFloat;
    }
  }.bind(this)()
};
