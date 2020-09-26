const { mutate_text } = require("./scenario/mutate_text");

function summarize_generation(rank, population) {
  const [best, best_survival_p] = population[population.length - 1];
  const [worst, worst_survival_p] = population[0];
  const best_survival = best_survival_p.toFixed(2);
  const worst_survival = worst_survival_p.toFixed(2);
  return `[${rank}] s:${population.length} f:${best_survival}-${worst_survival} b:"${best.phenotype}" (0x${best.genotype_byte_string})`;
}

const generations = mutate_text({
  initial_population: {
    length: 100,
    function: "random_text_being_of_random_target_length",
  },
  reproduction_rate: 20,
  target_text: {
    alphabet: "abcdefghijklmnopqrstuvwxyz ",
    text: "abc",
  },
  mutations: {
    functions: {
      insert_letter: 0,
      remove_letter: 0,
      replace_letter: 0,
      insert_byte: 1,
      remove_byte: 1,
      replace_byte: 0,
      alter_byte: 1000,
    },
    maximum_per_cycle: 1,
  },
  survival_probability: "evaluate_phenotype",
  selection: "select_best_percentile_with_stability",
  reproduction: {
    rate: 20,
    function: "clone_each_being",
  },
  maximum_rank: 10000,
  stop: {
    success: ["stop_when_survival_is_certain"],
    failure: ["stop_at_maximum_rank"],
  },
});

for (const { rank, population_with_survival_p } of generations) {
  const summary = summarize_generation(rank, population_with_survival_p);
  console.log(summary);
}
