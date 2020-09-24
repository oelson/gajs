const random = require("random");
const { select } = require("weighted");

class Hazard {
  constructor(mutation_weight_pairs, maximum) {
    this.mutations = [];
    this.weights = [];
    for (const [mutation, weight] of mutation_weight_pairs) {
      this.mutations.push(mutation);
      this.weights.push(weight);
    }
    this.maximum = maximum;
  }

  mutate(being) {
    for (const mutate of this.pick()) {
      mutate(being);
    }
  }

  *pick() {
    const times = random.int(1, this.maximum);
    for (let i = 1; i <= times; i++) {
      yield select(this.mutations, this.weights);
    }
  }
}

function build(mutation_index, mutation_names_and_weights, maximum_per_cycle) {
  const mutations_array = [];
  for (const [name, weight] of Object.entries(mutation_names_and_weights)) {
    const mutation_fn = mutation_index[name];
    mutations_array.push([mutation_fn, weight]);
  }
  return new Hazard(mutations_array, maximum_per_cycle);
}

module.exports = { Hazard, build };
