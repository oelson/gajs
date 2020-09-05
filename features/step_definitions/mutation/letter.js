const { Given, When, Then } = require("cucumber");
const assert = require("assert");
const {
  replace_letter,
  replace_random_letter,
} = require("../../../src/genetic_algorithm/mutation");
const { str_distance } = require("../../../src/genetic_algorithm/selection");

Given("un texte {string}", function (string) {
  this.initial_text = string;
});

Given("l'alphabet {string}", function (string) {
  this.alphabet = string;
});

When(
  "on remplace la lettre de position {int} par la lettre d'alphabet de position {int}",
  function (remplacement_index, alphabet_index) {
    this.modified_text = replace_letter(
      this.initial_text,
      remplacement_index,
      this.alphabet,
      alphabet_index
    );
  }
);

Then("le texte modifié est {string}", function (string) {
  assert.equal(this.modified_text, string);
});

When("on remplace aléatoirement une lettre", function () {
  this.modified_text = replace_random_letter(this.initial_text, this.alphabet);
});

Then(
  "le texte a été changé par {int} modification(s)",
  function (int) {
    const distance = str_distance(this.initial_text, this.modified_text);
    assert.equal(distance, int);
  }
);
