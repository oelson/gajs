const { Given, When, Then } = require("cucumber");
const assert = require("assert");
const {
  str_distance,
} = require("../../../src/genetic_algorithm/selection");


Given("un premier texte {string}", function (string) {
  this.strA = string;
});

Given("un second texte {string}", function (string) {
  this.strB = string;
});

When("je mesure la distance entre ces deux textes", function () {
  this.distance = str_distance(this.strA, this.strB);
});

Then("la distance est de {int} caractère(s)", function (distance) {
  assert.equal(distance, this.distance);
});
