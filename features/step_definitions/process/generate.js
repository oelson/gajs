const { Given, When, Then } = require("cucumber");
const assert = require("assert");
const { generate } = require("../../../src/genetic_algorithm/process");

Given("une population UTF-8 vide", function () {
  this.population = [];
});

Given("un cycle de vie trivial", function () {
  this.lifecycle = (x) => x;
});

Given("une condition d'arrêt sur population vide", function () {
  this.stop = (rank, population) => population.length === 0;
});

When("on crée les générations de cette population", function () {
  this.generations = Array.from(
    generate(this.population, this.lifecycle, this.stop)
  );
});

Then("on a {int} génération", function (int) {
  assert.equal(this.generations.length, int);
});
