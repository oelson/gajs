const { mutate_text } = require("./scenario/mutate_text");

mutate_text({
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
      insert_letter: 1,
      remove_letter: 1,
      replace_letter: 7,
    },
    maximum_per_cycle: 1,
  },
  survival_probability: "evaluate_phenotype",
  maximum_rank: 10000,
});
