const { Given, When, Then } = require("cucumber");
const assert = require("assert");
const mutation = require("../../../src/genetic_algorithm/mutation");
const { dataTableToUInt8Array } = require("../tool");

Given("la distribution de mutations", function (dataTable) {
  this.mutationArray = [];
  this.weightArray = [];
  for (const [functionName, weightStr] of dataTable.rawTable) {
    const mutationFunction = mutation[functionName];
    const weight = parseFloat(weightStr);
    this.mutationArray.push(mutationFunction);
    this.weightArray.push(weight);
  }
});

When(
  "on applique au vecteur UInt8 au maximum {int} mutation(s) aléatoire(s)",
  function (max) {
    const hazard = new mutation.Hazard(
      this.mutationArray,
      this.weightArray,
      max
    );
    hazard.mutate(this.uInt8Vector);
  }
);

Then("le vecteur UInt8 est", function (dataTable) {
  const expected = dataTableToUInt8Array(dataTable);
  assert.deepEqual(this.uInt8Vector, expected);
});

Then("le vecteur UInt8 est différent de", function (dataTable) {
  const unexpected = dataTableToUInt8Array(dataTable);
  assert.notDeepEqual(this.uInt8Vector, unexpected);
});

When("on applique au texte au maximum {int} mutations aléatoires", function (
  max
) {
  const hazard = new mutation.Hazard(this.mutationArray, this.weightArray, max);
  hazard.mutate(this.initial_text);
});

Then("le texte modifié est différent de {string}", function (unexpected) {
  assert.notEqual(this.modified_text, unexpected);
});
