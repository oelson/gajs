const { Given, When, Then } = require("cucumber");
const assert = require("assert");
const { generate } = require("../../../src/genetic_algorithm/process");
const { encode_utf8, Utf8Being } = require("../../../src/species/utf8");
const { find } = require("lodash");

Given("une population UTF-8 vide", function () {
  this.population = [];
});

Given("la population UTF-8", function (dataTable) {
  this.population = dataTable.rawTable
    .map((row) => row[0])
    .map((text) => encode_utf8(text))
    .map((bytes) => new Utf8Being(bytes));
});

Given("un cycle de vie éternel", function () {
  this.lifecycle = (x) => x;
});

Given("une condition d'arrêt sur population vide", function () {
  this.stop = (rank, population) => population.length === 0;
});

Given("une condition d'arrêt au delà de {int} générations", function (
  max_rank
) {
  this.stop = (rank, population) => rank > max_rank;
});

When("on crée les générations de cette population", function () {
  this.generations = Array.from(
    generate(this.population, this.lifecycle, this.stop)
  );
});

Then("on a {int} génération(s)", function (int) {
  assert.equal(this.generations.length, int);
});

Then("un individu de la dernière génération est {string}", function (text) {
  const lastGeneration = this.generations[this.generations.length - 1];
  const [lastRank, lastPopulation] = lastGeneration;
  const match = find(lastPopulation, (b) => b.phenotype === text);
  if (!match) assert.fail();
});
