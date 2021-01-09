const { select } = require("weighted")

function hazard(mutation_index, mutation_names_and_weights, number_per_cycle) {
  const mutations = []
  const weights = []

  for (const [name, weight] of Object.entries(mutation_names_and_weights)) {
    const mutation_fn = mutation_index[name]
    mutations.push(mutation_fn)
    weights.push(weight)
  }

  return function(being) {
    for (let i = 1; i <= number_per_cycle; i++) {
      const mutate = select(mutations, weights)
      mutate(being)
    }
  }
}

module.exports = { hazard }
