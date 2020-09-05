const { Given, When, Then } = require("cucumber");
const assert = require("assert");
const mutation = require("../../../src/genetic_algorithm/mutation");

function dataTableToUInt8Array(dataTable) {
  return dataTable.rawTable[0].map((n) => parseInt(n));
}

Given("un vecteur UInt8", function (dataTable) {
  this.uInt8Vector = dataTableToUInt8Array(dataTable);
});

Given("la distribution de mutations", function (dataTable) {
  this.mutationArray = [];
  this.weightArray = [];
  for (const row of dataTable.rawTable) {
    const [functionName, weightStr] = row;
    const mutationFunction = mutation[functionName];
    const weight = parseFloat(weightStr);
    this.mutationArray.push(mutationFunction);
    this.weightArray.push(weight);
  }
});

When("on applique au maximum {int} mutation(s) aléatoire(s)", function (max) {
  const hazard = new mutation.Hazard(this.mutationArray, this.weightArray, max);
  hazard.mutate(this.uInt8Vector);
});

Then("le vecteur UInt8 est", function (dataTable) {
    const expected = dataTableToUInt8Array(dataTable);
    assert.deepEqual(this.uInt8Vector, expected);
  });

  Then("le vecteur UInt8 est différent de", function (dataTable) {
    const unexpected = dataTableToUInt8Array(dataTable);
    assert.notDeepEqual(this.uInt8Vector, unexpected);
  });
    