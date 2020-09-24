const { mutate_text } = require("./scenario/mutate_text");
const { summarize_generation } = require("./ga/presentation");

const generations = mutate_text({
  initial_population: {
    length: 100,
    function: "random_text_being_of_random_target_length",
  },
  reproduction_rate: 20,
  target_text: {
    alphabet: "abcdefghijklmnopqrstuvwxyz ",
    text: "monique est super chouette",
  },
  mutations: {
    functions: {
      insert_letter: 0,
      remove_letter: 0,
      replace_letter: 0,
      insert_byte: 1,
      remove_byte: 1,
      replace_byte: 0,
      alter_byte: 0,
    },
    maximum_per_cycle: 1,
  },
  survival_probability: "evaluate_phenotype",
  maximum_rank: 10000,
});

for (const { rank, population_with_survival_p } of generations) {
  const summary = summarize_generation(rank, population_with_survival_p);
  console.log(summary);
}
