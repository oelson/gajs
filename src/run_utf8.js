const { mutate_text } = require("./scenario/mutate_text");

function summarize_generation(rank, population) {
  const [best, best_survival_p] = population[population.length - 1];
  const [worst, worst_survival_p] = population[0];
  const best_survival = best_survival_p.toFixed(2);
  const worst_survival = worst_survival_p.toFixed(2);
  return `[${rank}] s:${population.length} f:${best_survival}-${worst_survival} b:"${best.phenotype}" (0x${best.genotype_byte_string})`;
}

const generations = mutate_text({
  start: {
    length: 100,
    function: "random_variable_length",
  },
  reproduction: {
    rate: 20,
    function: "clone",
  },
  selection: {
    evaluation: "evaluate_phenotype",
    reduction: "keep_population_stable",
  },
  target: {
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
  stop: {
    rank: 10000,
    success: ["stop_when_survival_is_certain"],
    failure: ["stop_at_maximum_rank"],
  },
});

for (const { rank, population_with_survival_p } of generations) {
  const summary = summarize_generation(rank, population_with_survival_p);
  console.log(summary);
}
