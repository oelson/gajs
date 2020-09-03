const { Given, When, Then } = require("cucumber");
const assert = require("assert");
const {
  byte_vector_distance,
} = require("../../../src/genetic_algorithm/selection");

function parseByteVector(string) {
  return string.split(",").map((x) => parseInt(x));
}

Given("un premier vecteur d'octets {string}", function (vector) {
  this.vectorA = parseByteVector(vector);
});

Given("un second vecteur d'octets {string}", function (vector) {
  this.vectorB = parseByteVector(vector);
});

When("je mesure la distance entre ces deux vecteurs d'octets", function () {
  this.distance = byte_vector_distance(this.vectorA, this.vectorB);
});

Then("la distance est de {int} bit(s)", function (distance) {
  assert.equal(distance, this.distance);
});
