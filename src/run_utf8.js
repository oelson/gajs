const random = require("random");
const levenshtein = require("js-levenshtein");
const { summarize_generation } = require("./genetic_algorithm/presentation");
const {
  Utf8Being,
  Utf8Target,
  encode_utf8,
  insert_random_letter,
  remove_random_letter,
  replace_random_letter,
} = require("./species/utf8");
const { Hazard } = require("./genetic_algorithm/hazard");
const {
  flip_random_bit_in_random_byte,
  replace_random_byte,
  insert_random_byte,
  remove_random_byte,
} = require("./genetic_algorithm/genome");
const {
  generate,
  select_by_threshold,
  stop_at_certain_survival,
  stop_at_maximum_rank,
} = require("./genetic_algorithm/process");

const reproduction_rate = 20;
const survival_percentile = 1 / reproduction_rate;
const alphabet = "abcdefghijklmnopqrstuvwxyz ";
const target_string = "le cadavre exquis boira le vin nouveau";
const target = new Utf8Target(target_string);
const fitness = fitness_by_phenotype;
const hazard = new Hazard(
  [
    //[alter_byte, 1],
    //[replace_byte, 1],
    //[insert_byte, 1],
    //[remove_byte, 1],
    [insert_letter, 1],
    [remove_letter, 1],
    [replace_letter, 10],
  ],
  1
);

function fitness_by_genotype(being) {
  return levenshtein(being.genotype, target.genotype);
}

function fitness_by_phenotype(being) {
  return levenshtein(being.phenotype, target.phenotype);
}

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

function insert_byte(being) {
  insert_random_byte(being.genotype);
}

function remove_byte(being) {
  remove_random_byte(being.genotype);
}

function replace_byte(being) {
  replace_random_byte(being.genotype);
}

function alter_byte(being) {
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

function random_population_from_alphabet(length, alphabet) {
  const population = [];
  for (let i = 0; i < length; i++) {
    const size = random.int(0, target.phenotype.length);
    const phenotype = random_text(size, alphabet);
    const genotype = encode_utf8(phenotype);
    const being = new Utf8Being(genotype);
    population.push(being);
  }
  return population;
}

function random_text(length, alphabet) {
  let chars = [];
  for (var i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    const randomChar = alphabet.charAt(randomIndex);
    chars.push(randomChar);
  }
  return chars.join("");
}

const generations = generate({
  population: random_population_from_alphabet(100, alphabet),
  mutate: hazard_each_being,
  reproduce: clone_each_being,
  select: select_by_threshold(survival_probability, survival_percentile),
  success_conditions: [stop_at_certain_survival(survival_probability)],
  fail_conditions: [stop_at_maximum_rank(10000)],
});

for (const { rank, population } of generations) {
  const line = summarize_generation(rank, population, fitness);
  console.log(line);
}
