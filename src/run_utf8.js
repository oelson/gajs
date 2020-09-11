const { Utf8Being, Utf8Target } = require("./species/utf8");
const {
  Hazard,
  flip_bit_in_bytes,
  replace_random_letter_latin,
} = require("./genetic_algorithm/mutation");
const { generate } = require("./genetic_algorithm/process");

function mutate_bits(being) {
  flip_bit_in_bytes(being.genotype);
}

function mutate_letters(being) {
  being.phenotype = replace_random_letter_latin(being.phenotype);
}

function* reproduce_utf8_being(being) {
  for (let i = 0; i < 2; i++) {
    const genome_copy = being.genotype.slice();
    yield new Utf8Being(genome_copy);
  }
}

const t = new Utf8Target("le cadavre exquis boira le vin nouveau");

const h = new Hazard([mutate_letters], [1], 1);

const I = [];
for (let i = 0; i < 30; i++) {
  const b = t.random_being_from_alphabet("abcdefghijklmnopqrstuvwxyz");
  I.push(b);
}

const g = generate({
  population: I,
  reproduce: reproduce_utf8_being,
  mutate: b => h.mutate(b),
  fitness: b => t.fitness_by_phenotype(b),
  survival_percentile: 1 / 2,
  maximum_rank: 1000,
  target_fitness: 0,
});

for (const [r, p] of g) {
  console.log(r, g);
}