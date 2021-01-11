const { select } = require("weighted")

function* generate({
  population,
  reproduce,
  mutate,
  select,
  success,
  failure
}) {
  for (
    let rank = 1;
    population.length > 0 && !failure({ rank, population });
    rank++
  ) {
    yield { rank, population }
    if (success({ rank, population })) break
    mutate(population)
    const new_population = reproduce(population)
    population = select(new_population)
  }
}

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

module.exports = { generate, hazard }
