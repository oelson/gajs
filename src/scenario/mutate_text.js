const { distance: levenshtein } = require("fastest-levenshtein");
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
const { hazard } = require("../ga/hazard");
const {
  flip_random_bit_in_random_byte,
  replace_random_byte,
  insert_random_byte,
  remove_random_byte,
} = require("../ga/genome");
const { generate, keep_best_percentile } = require("../ga/process");

function* mutate_text({
  initial_population,
  reproduction,
  mutations,
  survival_probability,
  target_text,
  maximum_rank,
  stop,
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
        // workaround...
        const being_genotype_string = being.genotype_byte_string;
        const target_genotype_string = target.genotype_byte_string;
        const score = levenshtein(
          being_genotype_string,
          target_genotype_string
        );
        const death_probability = score / target_genotype_string.length;
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
    reproduction: {
      clone_each_being(population) {
        const offspring = [];
        for (const being of population) {
          for (let i = 0; i < reproduction.rate; i++) {
            const genome_copy = being.genotype.slice();
            offspring.push(new Utf8Being(genome_copy));
          }
        }
        return offspring;
      },
    },
    stop: {
      stop_at_maximum_rank({ rank }) {
        return rank > maximum_rank;
      },
      stop_when_survival_is_certain({ population }) {
        return population.some((being) => survival_p_fn(being) === 1);
      },
    },
  };

  function select_by_survival_probability(population) {
    const survival_percentile = 1 / reproduction.rate;
    return keep_best_percentile(population, survival_p_fn, survival_percentile);
  }

  const hazard_fn = hazard(
    choices.mutation,
    mutations.functions,
    mutations.maximum_per_cycle
  );
  const initial_population_fn = choices.population[initial_population.function];
  const target = new Utf8Target(target_text.text);
  const survival_p_fn = choices.evaluation[survival_probability];
  const reproduction_fn = choices.reproduction[reproduction.function];
  const success_fns = stop.success.map((success) => choices.stop[success]);
  const failure_fns = stop.failure.map((failure) => choices.stop[failure]);
  const success_fn = (g) => success_fns.some((f) => f(g) === true);
  const failure_fn = (g) => failure_fns.some((f) => f(g) === true);

  const generations = generate({
    population: collect(initial_population_fn, initial_population.length),
    mutate: (p) => p.forEach(hazard_fn),
    reproduce: reproduction_fn,
    select: select_by_survival_probability,
    success: success_fn,
    failure: failure_fn,
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
