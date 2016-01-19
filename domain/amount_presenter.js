var Amount = require('./amount');
var UnitReducer = require('./unit_reducer');
var QuantityPresenter = require('./quantity_presenter');

var Inflector = require('./inflector');
var inflector = new Inflector();

var AmountPresenter = function(unreducedAmount) {
  this.amount = new UnitReducer(unreducedAmount).reducedAmount;

  this.quantity = this.amount.quantity;
  this.unit = this.amount.unit;
  
  this.epsilon = 0.0001;
  
  this.amounts = function() {
    if (this.quantity < this.epsilon) {
      return [];
    }
    
    if (this.unit.isWhole) {
      return [this.amount];
    }

    var multipleOfSmallestAcceptableUnit = this.quantity / this.unit.smallestMeasure;
    if (Number.isInteger(multipleOfSmallestAcceptableUnit)) {
      return [this.amount];
    }
    
    var integerMultipleOfSmallestAcceptableUnit = Math.floor(multipleOfSmallestAcceptableUnit + this.epsilon);
    var acceptableQuantityInCurrentUnit = integerMultipleOfSmallestAcceptableUnit * this.unit.smallestMeasure;
    var remainderForUseInSmallerUnit = this.quantity - acceptableQuantityInCurrentUnit;
    var amountRemaining = new Amount(remainderForUseInSmallerUnit, this.unit);

    return [new Amount(acceptableQuantityInCurrentUnit, this.unit)].concat(new AmountPresenter(amountRemaining).amounts);
  }.bind(this)();
  
  this.amountForDisplay = this.amounts
    .map(function(amount) {
      var quantity = new QuantityPresenter(amount.quantity).quantityForDisplay;
      var unit = inflector.pluralizeWithCount(amount.unit.name, amount.quantity);
      return (quantity + ' ' + unit).trim();
    }.bind(this)).join(' + ');
};

module.exports = AmountPresenter;
