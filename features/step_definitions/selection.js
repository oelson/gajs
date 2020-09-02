const { Given, When, Then } = require("cucumber");
const assert = require("assert");
const {
  byte_vector_distance,
} = require("../../src/genetic_algorithm/selection");

function parseByteVector(string) {
  return string.split(",").map((x) => parseInt(x));
}

Given("a first byte vector {string}", function (vector) {
  this.vectorA = parseByteVector(vector);
});

Given("a second byte vector {string}", function (vector) {
  this.vectorB = parseByteVector(vector);
});

When("I measure the distance between the two vectors", function () {
  this.distance = byte_vector_distance(this.vectorA, this.vectorB);
});

Then("the distance should be {int}", function (int) {
  assert.equal(int, this.distance);
});
