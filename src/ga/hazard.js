const random = require("random");
const { select } = require("weighted");

function hazard(mutation_index, mutation_names_and_weights, maximum_per_cycle) {
  const mutations = [];
  const weights = [];

  for (const [name, weight] of Object.entries(mutation_names_and_weights)) {
    const mutation_fn = mutation_index[name];
    mutations.push(mutation_fn);
    weights.push(weight);
  }

  return function (being) {
    const times = random.int(1, maximum_per_cycle);
    for (let i = 1; i <= times; i++) {
      const mutate = select(mutations, weights);
      mutate(being);
    }
  };
}

module.exports = { hazard };
