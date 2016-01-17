var QuantityPresenter = require('../domain/presenters').QuantityPresenter;
var assert = require('assert');

describe("quantity presenter", function() {
  
  it("should present quantities", function() {
    var quantityPresenter = new QuantityPresenter(1);
    assert.equal(quantityPresenter.quantityForDisplay, "1");
  });
  
  it("should present fractions", function() {
    var quantityPresenter = new QuantityPresenter(0.75);
    assert.equal(quantityPresenter.quantityForDisplay, "¾");
  });
  
  it("should present decimals", function() {
    var quantityPresenter = new QuantityPresenter(0.65);
    assert.equal(quantityPresenter.quantityForDisplay, "0.65");
  });

});