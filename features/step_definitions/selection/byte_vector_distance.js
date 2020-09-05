const { Given, When, Then } = require("cucumber");
const assert = require("assert");
const {
  byte_vector_distance,
} = require("../../../src/genetic_algorithm/selection");
const { dataTableToUInt8Array } = require("../tool");

Given("un premier vecteur UInt8", function (dataTable) {
  this.vectorA = dataTableToUInt8Array(dataTable);
});

Given("un second vecteur UInt8", function (dataTable) {
  this.vectorB = dataTableToUInt8Array(dataTable);
});

When("je mesure la distance entre ces deux vecteurs d'octets", function () {
  this.distance = byte_vector_distance(this.vectorA, this.vectorB);
});

Then("la distance est de {int} bit(s)", function (distance) {
  assert.equal(distance, this.distance);
});
