const { stdout } = require("process");
const { byte_string } = require("./genetic_algorithm/presentation");
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

function* reproduce(being) {
  for (let i = 0; i < 2; i++) {
    const genome_copy = being.genotype.slice();
    yield new Utf8Being(genome_copy);
  }
}

function fitness(being) {
  return t.fitness_by_phenotype(being);
}

function mutate(being) {
  h.mutate(being);
}

function maximum_rank_exceeded({ rank }) {
  return rank > 1000;
}

function target_fitness_reached({ population }) {
  return population.some((b) => fitness(b) === 0);
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
  reproduce,
  mutate,
  fitness,
  survival_percentile: 1 / 2,
  stop_conditions: [maximum_rank_exceeded, target_fitness_reached],
});


for (const [r, p] of g) {
  const best = p[0];
  const worst = p[p.length - 1];
  const best_fitness = fitness(best);
  const worst_fitness = fitness(worst);
  stdout.write(
    `\r[${r}] fitness:${best_fitness}-${worst_fitness} "${
      best.phenotype
    }" (${byte_string(best.genotype)})`
  );
}
