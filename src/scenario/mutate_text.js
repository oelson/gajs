const { distance: levenshtein } = require("fastest-levenshtein");
const {
  utf8_being,
  utf8_target,
  encode_utf8,
  insert_random_letter,
  remove_random_letter,
  replace_random_letter,
  random_text_being_of_random_length,
  random_text_being_of_fixed_length,
} = require("../species/utf8");
const { hazard } = require("../ga/hazard");
const {
  flip_random_bit_in_random_byte,
  replace_random_byte,
  insert_random_byte,
  remove_random_byte,
} = require("../ga/genome");
const { generate, select_best_percentile } = require("../ga/process");

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
      },
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
      },
    },
    selection: {
      keep_population_stable(population) {
        return select_best_percentile(
          population,
          survival_p_fn,
          1 - 1 / conf.reproduction.rate
        );
      },
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
      },
    },
    reproduction: {
      clone(being) {
        const genome_copy = being.genotype.slice();
        const clone = utf8_being(genome_copy);
        return clone;
      },
    },
    stop: {
      stop_at_maximum_rank({ rank }) {
        return rank > conf.stop.rank;
      },
      stop_when_survival_is_certain({ population }) {
        return population.some((being) => survival_p_fn(being) === 1);
      },
    },
  };

  const hazard_fn = hazard(
    choices.mutation,
    conf.mutations.functions,
    conf.mutations.maximum_per_cycle
  );
  const initial_population_fn = choices.population[conf.start.function];
  const target_b = utf8_target(conf.target.text);
  const survival_p_fn = choices.evaluation[conf.selection.evaluation];
  const select_fn = choices.selection[conf.selection.reduction];
  const reproduction_fn = choices.reproduction[conf.reproduction.function];
  const success_fns = conf.stop.success.map((success) => choices.stop[success]);
  const failure_fns = conf.stop.failure.map((failure) => choices.stop[failure]);
  const success_fn = (g) => success_fns.some((f) => f(g) === true);
  const failure_fn = (g) => failure_fns.some((f) => f(g) === true);

  function reproduce(population) {
    const offspring = [];
    for (const being of population) {
      for (let i = 0; i < conf.reproduction.rate; i++) {
        const child = reproduction_fn(being);
        offspring.push(child);
      }
    }
    return offspring;
  }

  const generations = generate({
    population: collect(initial_population_fn, conf.start.length),
    mutate: (p) => p.forEach(hazard_fn),
    reproduce: reproduce,
    select: select_fn,
    success: success_fn,
    failure: failure_fn,
  });

  return yield_generations_with_survival_p(generations, survival_p_fn);
}

function collect(func, times) {
  const l = [];
  for (let i = 0; i < times; i++) {
    const x = func();
    l.push(x);
  }
  return l;
}

function* yield_generations_with_survival_p(generations, survival_p_fn) {
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

module.exports = { mutate_text };
