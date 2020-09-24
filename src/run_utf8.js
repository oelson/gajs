const levenshtein = require("js-levenshtein");
const { summarize_generation } = require("./ga/presentation");
const {
  Utf8Being,
  Utf8Target,
  encode_utf8,
  insert_random_letter,
  remove_random_letter,
  replace_random_letter,
  random_text_being_of_random_length,
  random_text_being_of_fixed_length,
} = require("./species/utf8");
const { Hazard } = require("./ga/hazard");
const {
  flip_random_bit_in_random_byte,
  replace_random_byte,
  insert_random_byte,
  remove_random_byte,
} = require("./ga/genome");
const {
  generate,
  keep_best_percentile,
  stop_when_survival_is_certain,
  stop_at_maximum_rank,
} = require("./ga/process");

function build_hazard(mutation_index, choices, maximum) {
  const mutations_array = [];
  for (const [name, weight] of Object.entries(choices)) {
    const mutation = mutation_index[name];
    mutations_array.push([mutation, weight]);
  }
  return new Hazard(mutations_array, maximum);
}

/*
 * Ensemble des saisies
 */
function mutate_text({
  initial_population_length,
  reproduction_rate,
  alphabet,
  target_string,
  mutations_with_weights,
  maximum_mutations_per_cycle,
}) {
  const hazard = build_hazard(
    {
      insert_letter(being) {
        const new_phenotype = insert_random_letter(being.phenotype, alphabet);
        being.genotype = encode_utf8(new_phenotype);
      },
      remove_letter(being) {
        const new_phenotype = remove_random_letter(being.phenotype);
        being.genotype = encode_utf8(new_phenotype);
      },
      replace_letter(being) {
        const new_phenotype = replace_random_letter(being.phenotype, alphabet);
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
    mutations_with_weights,
    maximum_mutations_per_cycle
  );
  
  const fitness = fitness_by_phenotype;
  const survival_probability = survival_probability_by_phenotype;

  /*
   * Initialisation
   */
  const survival_percentile = 1 / reproduction_rate;
  const target = new Utf8Target(target_string);

  function fitness_by_genotype(being) {
    return levenshtein(being.genotype, target.genotype);
  }

  function fitness_by_phenotype(being) {
    return levenshtein(being.phenotype, target.phenotype);
  }

  function survival_probability_by_phenotype(being) {
    const score = fitness_by_phenotype(being);
    const death_probability = score / target.phenotype.length;
    return 1 - death_probability;
  }

  function survival_probability_by_genotype(being) {
    const score = fitness_by_genotype(being);
    const death_probability = score / target.genotype.length;
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

  function collect(func, times) {
    const l = [];
    for (let i = 0; i < times; i++) {
      const x = func();
      l.push(x);
    }
    return l;
  }

  function random_text_being_of_fixed_target_length() {
    return random_text_being_of_fixed_length(alphabet, target.phenotype.length);
  }

  function random_text_being_of_random_target_length() {
    return random_text_being_of_random_length(
      alphabet,
      target.phenotype.length
    );
  }

  function select_by_survival_probability(population) {
    return keep_best_percentile(
      population,
      survival_probability,
      survival_percentile
    );
  }

  /*
   * Génération
   */
  const generations = generate({
    population: collect(
      random_text_being_of_random_target_length,
      initial_population_length
    ),
    mutate: hazard_each_being,
    reproduce: clone_each_being,
    select: select_by_survival_probability,
    success_conditions: [stop_when_survival_is_certain(survival_probability)],
    fail_conditions: [stop_at_maximum_rank(10000)],
  });

  for (const { rank, population } of generations) {
    const line = summarize_generation(rank, population, fitness);
    console.log(line);
  }
}

mutate_text({
  initial_population_length: 100,
  reproduction_rate: 20,
  alphabet: "abcdefghijklmnopqrstuvwxyz ",
  target_string: "monique est super chouette",
  mutations_with_weights: {
    insert_letter: 1,
    remove_letter: 1,
    replace_letter: 7,
  },
  maximum_mutations_per_cycle: 1,
});
