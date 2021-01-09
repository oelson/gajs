const { distance: levenshtein } = require("fastest-levenshtein");
const {
  utf8_being,
  utf8_target,
  encode_utf8,
  insert_random_letter,
  remove_random_letter,
  replace_random_letter,
  random_text_being_of_random_length,
  random_text_being_of_fixed_length
} = require("../species/utf8");
const { hazard } = require("../ga/hazard");
const {
  flip_random_bit_in_random_byte,
  replace_random_byte,
  insert_random_byte,
  remove_random_byte
} = require("../ga/bytes");
const { generate } = require("../ga/process");
const { sortBy } = require("lodash");
const { byte_string } = require("../presentation");

function mutate_text(conf) {
  const choices = {
    mutation: {
      insert_letter(being) {
        const new_phenotype = insert_random_letter(
          being.phenotype,
          conf.target.alphabet
        );
        being.genotype = encode_utf8(new_phenotype);
      },
      remove_letter(being) {
        const new_phenotype = remove_random_letter(being.phenotype);
        being.genotype = encode_utf8(new_phenotype);
      },
      replace_letter(being) {
        const new_phenotype = replace_random_letter(
          being.phenotype,
          conf.target.alphabet
        );
        being.genotype = encode_utf8(new_phenotype);
      },
      insert_byte(being) {
        insert_random_byte(being.genotype);
      },
      remove_byte(being) {
        remove_random_byte(being.genotype);
      },
      replace_byte(being) {
        replace_random_byte(being.genotype);
      },
      alter_byte(being) {
        flip_random_bit_in_random_byte(being.genotype);
      }
    },
    evaluation: {
      evaluate_phenotype(being) {
        const score = levenshtein(being.phenotype, target_b.phenotype);
        const death_probability = score / target_b.phenotype.length;
        return 1 - death_probability;
      },
      evaluate_genotype(being) {
        // workaround...
        const being_genotype_string = being.genotype_byte_string;
        const target_genotype_string = target_b.genotype_byte_string;
        const score = levenshtein(
          being_genotype_string,
          target_genotype_string
        );
        const death_probability = score / target_genotype_string.length;
        return 1 - death_probability;
      }
    },
    selection: {
      keep_population_stable(population) {
        const competition = sortBy(population, [b => b.survival_p]);
        const percentile = 1 - 1 / conf.reproduction.rate;
        const threshold = parseInt(population.length * percentile);
        return competition.slice(threshold);
      }
    },
    population: {
      random_fixed_length() {
        return random_text_being_of_fixed_length(
          conf.target.alphabet,
          target_b.phenotype.length
        );
      },
      random_variable_length() {
        return random_text_being_of_random_length(
          conf.target.alphabet,
          target_b.phenotype.length
        );
      }
    },
    reproduction: {
      clone(being) {
        const genome_copy = being.genotype.slice();
        return utf8_being(genome_copy);
      }
    }
  };

  const hazard_fn = hazard(
    choices.mutation,
    conf.mutations.functions,
    conf.mutations.number_per_cycle
  );
  const initial_population_fn = choices.population[conf.start.function];
  const target_b = utf8_target(conf.target.text);
  const survival_p_fn = choices.evaluation[conf.selection.evaluation];
  const select_fn = choices.selection[conf.selection.reduction];
  const reproduction_fn = choices.reproduction[conf.reproduction.function];

  function success({ population }) {
    return population.some(being => being.survival_p >= conf.stop.survival_p);
  }

  function failure({ rank }) {
    return rank > conf.stop.rank;
  }

  function label(being, ancestors) {
    being.survival_p = survival_p_fn(being);
    being.ancestors = ancestors;
    being.genotype_byte_string = byte_string(being.genotype);
  }

  function initial_population() {
    const population = [];
    for (let i = 0; i < conf.start.length; i++) {
      const being = initial_population_fn();
      label(being, []);
      population.push(being);
    }
    return population;
  }

  function reproduce(population) {
    const offspring = [];
    for (const parent of population) {
      for (let i = 0; i < conf.reproduction.rate; i++) {
        const child = reproduction_fn(parent);
        label(child, [parent]);
        offspring.push(child);
      }
    }
    return offspring;
  }

  const generations = generate({
    population: initial_population(),
    mutate: p => p.forEach(hazard_fn),
    reproduce: reproduce,
    select: select_fn,
    success,
    failure
  });

  return generations;
}

module.exports = { mutate_text };
