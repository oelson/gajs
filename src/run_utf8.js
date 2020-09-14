// Idée: tout l'outillage de ce fichier, à déplacer avec Utf8Being car c'est indisociable
// Ne reste ici que le paramétrage et la présentation
const { stdout } = require("process");
const { summarize_generation } = require("./genetic_algorithm/presentation");
const {
  Utf8Being,
  Utf8Target,
  encode_utf8,
  insert_random_letter,
  remove_random_letter,
  replace_random_letter,
} = require("./species/utf8");
const {
  Hazard,
  flip_random_bit_in_random_byte,
} = require("./genetic_algorithm/mutation");
const {
  generate,
  select_by_threshold,
  stop_at_target_fitness,
  stop_at_maximum_rank,
} = require("./genetic_algorithm/process");

const reproduction_rate = 20;
const survival_percentile = 1 / reproduction_rate;
const alphabet = "abcdefghijklmnopqrstuvwxyz ";
const target_string = "le cadavre exquis boira le vin nouveau";
const target = new Utf8Target(target_string, alphabet);
const fitness = target.fitness_by_phenotype.bind(target);
const hazard = new Hazard(
  [
    [insert_letter, 1],
    [remove_letter, 1],
    [replace_letter, 1],
  ],
  1
);

function insert_letter(being) {
  const new_phenotype = insert_random_letter(being.phenotype, alphabet);
  being.genotype = encode_utf8(new_phenotype);
}

function remove_letter(being) {
  const new_phenotype = remove_random_letter(being.phenotype);
  being.genotype = encode_utf8(new_phenotype);
}

function replace_letter(being) {
  const new_phenotype = replace_random_letter(being.phenotype, alphabet);
  being.genotype = encode_utf8(new_phenotype);
}

function mutate_bytes(being) {
  flip_random_bit_in_random_byte(being.genotype);
}

function survival_probability(being) {
  const score = fitness(being);
  const death_probability = score / target_string.length;
  return 1 - death_probability;
}

function hazard_each_being(population) {
  for (const being of population) {
    hazard.mutate(being);
  }
}

function clone_each_being(population) {
  const offspring = [];
  for (const being of population) {
    for (let i = 0; i < reproduction_rate; i++) {
      const genome_copy = being.genotype.slice();
      offspring.push(new Utf8Being(genome_copy));
    }
  }
  return offspring;
}

function random_population_from_alphabet(length) {
  const population = [];
  for (let i = 0; i < length; i++) {
    const b = target.random_being_from_alphabet();
    population.push(b);
  }
  return population;
}

const generations = generate({
  population: random_population_from_alphabet(100),
  mutate: hazard_each_being,
  reproduce: clone_each_being,
  select: select_by_threshold(survival_probability, survival_percentile),
  success_conditions: [stop_at_target_fitness(0, fitness)],
  fail_conditions: [stop_at_maximum_rank(10000)],
});

for (const { rank, population } of generations) {
  const line = summarize_generation(rank, population, fitness);
  console.log(line);
}
