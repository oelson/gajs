// Idée: tout l'outillage de ce fichier, à déplacer avec Utf8Being car c'est indisociable
// Ne reste ici que le paramétrage et la présentation
const { stdout } = require("process");
const { summarize_generation } = require("./genetic_algorithm/presentation");
const { Utf8Being, Utf8Target, encode_utf8 } = require("./species/utf8");
const {
  Hazard,
  replace_random_letter,
} = require("./genetic_algorithm/mutation");
const {
  generate,
  select_by_threshold,
  stop_at_target_fitness,
  stop_at_maximum_rank,
} = require("./genetic_algorithm/process");
const levenshtein = require("js-levenshtein");

const reproduction_rate = 5;
const survival_percentile = 1 / reproduction_rate;
const alphabet = "abcdefghijklmnopqrstuvwxyz ";
const target_string = "cadavre exquis";
const t = new Utf8Target(target_string);
const h = new Hazard([mutate_letters, (_) => _], [3 / 10, 7 / 10], 3);

function mutate_letters(being) {
  const new_phenotype = replace_random_letter(being.phenotype, alphabet);
  const new_genome = encode_utf8(new_phenotype);
  being.genotype = new_genome;
}

function fitness(being) {
  return levenshtein(being.phenotype, t.target.phenotype);
}

function survival_probability(being) {
  const score = fitness(being);
  return 1 - score / target_string.length;
}

function mutate(population) {
  for (const being of population) {
    h.mutate(being);
  }
}

function reproduce(population) {
  const offspring = [];
  for (const being of population) {
    for (let i = 0; i < reproduction_rate; i++) {
      const genome_copy = being.genotype.slice();
      offspring.push(new Utf8Being(genome_copy));
    }
  }
  return offspring;
}

function random_population(length) {
  const population = [];
  for (let i = 0; i < length; i++) {
    const b = t.random_being_from_alphabet(alphabet);
    population.push(b);
  }
  return population;
}

const generations = generate({
  population: random_population(100),
  mutate,
  reproduce,
  select: select_by_threshold(survival_probability, survival_percentile),
  success_conditions: [stop_at_target_fitness(0, fitness)],
  fail_conditions: [stop_at_maximum_rank(1000)],
});

for (const { rank, population } of generations) {
  const line = summarize_generation(rank, population, fitness);
  stdout.write(`\r${line}`);
}

stdout.write("\n");
