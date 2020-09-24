const levenshtein = require("js-levenshtein");
const {
  Utf8Being,
  Utf8Target,
  encode_utf8,
  insert_random_letter,
  remove_random_letter,
  replace_random_letter,
  random_text_being_of_random_length,
  random_text_being_of_fixed_length,
} = require("../species/utf8");
const { Hazard } = require("../ga/hazard");
const {
  flip_random_bit_in_random_byte,
  replace_random_byte,
  insert_random_byte,
  remove_random_byte,
} = require("../ga/genome");
const {
  generate,
  keep_best_percentile,
  stop_when_survival_is_certain,
  stop_at_maximum_rank,
} = require("../ga/process");

function* mutate_text({
  initial_population,
  reproduction_rate,
  mutations,
  survival_probability,
  target_text,
  maximum_rank,
}) {
  const choices = {
    mutation: {
      insert_letter(being) {
        const new_phenotype = insert_random_letter(
          being.phenotype,
          target_text.alphabet
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
          target_text.alphabet
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
      },
    },
    evaluation: {
      evaluate_phenotype(being) {
        const score = levenshtein(being.phenotype, target.phenotype);
        const death_probability = score / target.phenotype.length;
        return 1 - death_probability;
      },
      evaluate_genotype(being) {
        const score = levenshtein(being.genotype, target.genotype);
        const death_probability = score / target.genotype.length;
        return 1 - death_probability;
      },
    },
    population: {
      random_text_being_of_fixed_target_length() {
        return random_text_being_of_fixed_length(
          target_text.alphabet,
          target.phenotype.length
        );
      },
      random_text_being_of_random_target_length() {
        return random_text_being_of_random_length(
          target_text.alphabet,
          target.phenotype.length
        );
      },
    },
  };

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

  function select_by_survival_probability(population) {
    const survival_percentile = 1 / reproduction_rate;
    return keep_best_percentile(population, survival_p_fn, survival_percentile);
  }

  const mutations_array = [];
  for (const [name, weight] of Object.entries(mutations.functions)) {
    const mutation_fn = choices.mutation[name];
    mutations_array.push([mutation_fn, weight]);
  }
  const hazard = new Hazard(mutations_array, mutations.maximum_per_cycle);
  const initial_population_fn = choices.population[initial_population.function];
  const target = new Utf8Target(target_text.text);
  const survival_p_fn = choices.evaluation[survival_probability];

  const generations = generate({
    population: collect(initial_population_fn, initial_population.length),
    mutate: hazard_each_being,
    reproduce: clone_each_being,
    select: select_by_survival_probability,
    success_conditions: [stop_when_survival_is_certain(survival_p_fn)],
    fail_conditions: [stop_at_maximum_rank(maximum_rank)],
  });

  for (const { rank, population } of generations) {
    const population_with_survival_p = [];
    for (const being of population) {
      const being_survival_p = survival_p_fn(being);
      const pair = [being, being_survival_p];
      population_with_survival_p.push(pair);
    }
    yield { rank, population_with_survival_p };
  }
}

function collect(func, times) {
  const l = [];
  for (let i = 0; i < times; i++) {
    const x = func();
    l.push(x);
  }
  return l;
}

module.exports = { mutate_text };
