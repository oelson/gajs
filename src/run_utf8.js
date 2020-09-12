// Idée: tout l'outillage de ce fichier, à déplacer avec Utf8Being car c'est indisociable
// Ne reste ici que le paramétrage et la présentation
const { stdout } = require("process");
const { byte_string } = require("./genetic_algorithm/presentation");
const { target_fitness, maximum_rank } = require("./genetic_algorithm/stop");
const { Utf8Being, Utf8Target, encode_utf8 } = require("./species/utf8");
const {
  Hazard,
  replace_random_letter,
} = require("./genetic_algorithm/mutation");
const { generate } = require("./genetic_algorithm/process");
const levenshtein = require("js-levenshtein");

const reproduction_rate = 5;
const survival_percentile = 1 / reproduction_rate;
const alphabet = "abcdefghijklmnopqrstuvwxyz ";
const target_string = "cadavre exquis";
const t = new Utf8Target(target_string);
const h = new Hazard([mutate_letters, (_) => _], [4 / 10, 6 / 10], 2);

function mutate_letters(being) {
  const new_phenotype = replace_random_letter(being.phenotype, alphabet);
  const new_genome = encode_utf8(new_phenotype);
  being.genotype = new_genome;
}

function reproduce(being) {
  const offspring = [];
  for (let i = 0; i < reproduction_rate; i++) {
    const genome_copy = being.genotype.slice();
    offspring.push(new Utf8Being(genome_copy));
  }
  return offspring;
}

function fitness(being) {
  return levenshtein(being.phenotype, t.target.phenotype);
}

function mutate(being) {
  h.mutate(being);
}

function random_population(length) {
  const population = [];
  for (let i = 0; i < length; i++) {
    const b = t.random_being_from_alphabet(alphabet);
    population.push(b);
  }
  return population;
}

function summarize({ rank, population }) {
  const best = population[0];
  const worst = population[population.length - 1];
  const best_fitness = fitness(best);
  const worst_fitness = fitness(worst);
  return `\r[${rank}] s:${
    population.length
  } f:${best_fitness}-${worst_fitness} b:"${best.phenotype}" (0x${byte_string(
    best.genotype
  )})`;
}

const generations = generate({
  population: random_population(100),
  reproduce,
  mutate,
  fitness,
  survival_percentile,
  stop_conditions: [maximum_rank(1000), target_fitness(0, fitness)],
});

for (const generation of generations) {
  const line = summarize(generation);
  stdout.write(line);
}

stdout.write("\n");
