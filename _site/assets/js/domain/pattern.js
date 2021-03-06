var Unit = require('./unit');
var IngredientLine = require('./ingredient_line');
var Amount = require('./amount');
var QuantityParser = require('./quantity_parser');

var allUnitRegex = '(' + Unit.allUnitNames().map(function(unitName) {
  return '\\b' + unitName + '\\b'
}).join('|') + ')';

var Pattern = function(template) {
  this.template = template;

  this.quantityRegex = '(' + QuantityParser.quantityRegexes.join('|') + ')';
  this.ingredientRegex = '(.+)';
  this.allUnitRegex = allUnitRegex;

  this.preparedTemplate = function() {
    var preparedTemplate = this.template;

    preparedTemplate = preparedTemplate.replace(/\s+/g, '\\s+');
    preparedTemplate = preparedTemplate.replace('{quantity}', this.quantityRegex);
    preparedTemplate = preparedTemplate.replace('{unit}', this.allUnitRegex);
    preparedTemplate = preparedTemplate.replace('{ingredient}', this.ingredientRegex);

    return preparedTemplate;
  }.bind(this)();

  this.regex = new RegExp(this.preparedTemplate);

  this.matches = function(against) {
    return this.regex.test(against);
  }.bind(this);

  this.parse = function(against) {
    var results = this.regex.exec(against);
    results.shift();
    var quantity, unit, ingredientName;
    for (var i = 0; i < results.length; i++) {
      var result = results[i];
      if (new RegExp(this.quantityRegex).test(result)) {
        quantity = result;
      } else if (new RegExp(this.allUnitRegex).test(result)) {
        unit = Unit.unitFromName(result);
      } else if (new RegExp(this.ingredientRegex).test(result)) {
        ingredientName = result;
      }
    }
    return new IngredientLine(new Amount(quantity, unit), ingredientName);
  }.bind(this);

  this.inject = function(injectables) {
    var injected = this.template;
    for (var key in injectables) {
      var value = injectables[key];
      injected = injected.replace(key, value);
    }
    return injected;
  }.bind(this);
};


Pattern.allPatterns = [
  new Pattern("{ingredient} to taste"),
  new Pattern("{ingredient} as desired"),
  new Pattern("{quantity} {unit} of {ingredient}"), // 2 sticks of butter, 2-3 tablespoons of sugar
  new Pattern("{quantity} {unit} {ingredient}"), //1 cup flour
  new Pattern("{quantity} {ingredient}"), //an egg, 
  //{quantity} {unit} plus {quantity} {unit} {ingredient} 
];

module.exports = Pattern;
