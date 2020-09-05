const { Given, When, Then } = require("cucumber");
const assert = require("assert");
const { truncate } = require("../../../src/genetic_algorithm/process");
const { find } = require("lodash");

function voyelleNess(text) {
  if (text === "") return 0;
  let count = 0;
  for (const letter of text) {
    for (const voyelle of "aeiouy") {
      if (letter === voyelle) {
        count++;
      }
    }
  }
  return count / text.length;
}

Given("une fonction de sélection par la présence de voyelles", function () {
  // 0 = cible atteinte (= 100 % de voyelles)
  this.fitness = function (being) {
    return 1 - voyelleNess(being.phenotype);
  };
});

Given("un percentile de survie de {float}%", function (percentile) {
  this.percentile = percentile / 100.0;
});

When("on tronque la population", function () {
  this.truncated_population = truncate(
    this.population,
    this.fitness,
    this.percentile
  );
});

Then("la population UTF-8 contient", function (dataTable) {
    const expectedPopulation = dataTable.rawTable.map((row) => row[0]);
    for (const expectedText of expectedPopulation) {
      const match = find(
        this.truncated_population,
        (b) => b.phenotype === expectedText
      );
      if (!match) assert.fail(`individu non trouvé "${expectedText}"`);
    }
  });

  Then("la population UTF-8 ne contient pas", function (dataTable) {
    const unexpectedPopulation = dataTable.rawTable.map((row) => row[0]);
    for (const unexpectedText of unexpectedPopulation) {
      const match = find(
        this.truncated_population,
        (b) => b.phenotype === unexpectedText
      );
      if (match) assert.fail(`individu trouvé à tort "${unexpectedText}"`);
    }
  });
    