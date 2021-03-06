var Amount = require('./amount');
var UnitReducer = require('./unit_reducer');
var QuantityPresenter = require('./quantity_presenter');

var Inflector = require('../inflector');
var inflector = new Inflector();

var AmountPresenter = function(amount) {
  this.amount = amount;
  
  this.epsilon = 0.0001;
  
  this.iterationLimit = 10;

  this.amounts = function() {
    if (this.amount.unit.isWhole) {
      return [this.amount];
    }
    
    if ((this.amount.unit.name === 'pinch' || this.amount.unit.name === 'dash') && this.amount.quantity <= 3) {
      return [this.amount];
    }
    
    var amounts = [];
    var amountRemaining = this.amount;
    
    while (amountRemaining.quantity > this.epsilon) {
      if (this.iterationLimit-- <= 0) {
        break;
      }
      
      amountRemaining = new UnitReducer(amountRemaining).reducedAmount;
      var quantity = amountRemaining.quantity;
      var unit = amountRemaining.unit;

      if (unit.name === 'pinch' || unit.name === 'dash') {
        break;
      }
      
      var multipleOfSmallestAcceptableUnit = quantity / unit.smallestMeasure;
    
      var integerMultipleOfSmallestAcceptableUnit = Math.floor(multipleOfSmallestAcceptableUnit + this.epsilon);
      var acceptableQuantityInCurrentUnit = integerMultipleOfSmallestAcceptableUnit * unit.smallestMeasure;
      var remainderForUseInSmallerUnit = quantity - acceptableQuantityInCurrentUnit;
      
      amounts.push(new Amount(acceptableQuantityInCurrentUnit, unit));
      
      amountRemaining = new Amount(remainderForUseInSmallerUnit, unit);
    }
    
    return amounts;
  }.bind(this)();
  
  this.amountForDisplay = this.amounts
    .map(function(amount) {
      var quantity = new QuantityPresenter(amount.quantity).quantityForDisplay;
      var unit = inflector.pluralizeWithCount(amount.unit.name, amount.quantity);
      return (quantity + ' ' + unit).trim();
    }.bind(this)).join(' + ');
};

module.exports = AmountPresenter;
