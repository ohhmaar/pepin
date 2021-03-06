var Inflector = require('../assets/js/inflector');
var assert = require('assert');

describe("inflector", function() {
  var inflector = new Inflector()
  
  it("should pluralize a unit", function() {
    var cups = inflector.plural('cup');
    assert.equal(cups, 'cups');
  });
  
  it("should singularize a unit", function() {
    var cup = inflector.singular('cups');
    assert.equal(cup, 'cup');
  });
    
  it("should pluralize a unit given a non-one number", function() {
    var string = inflector.pluralizeWithCount('cup', 2);
    assert.equal(string, 'cups');
  });
  
  it("shouldn't pluralize a unit given one", function() {
    var string = inflector.pluralizeWithCount('cup', 1);
    assert.equal(string, 'cup');
  });
  
  it("shouldn't pluralize an already pluralized number", function() {
    var string = inflector.pluralizeWithCount('cups', 2);
    assert.equal(string, 'cups');
  });
  
  it("shouldn't pluralize a number less than one", function() {
    var string = inflector.pluralizeWithCount('cup', 0.25);
    assert.equal(string, 'cup');
  });
});
