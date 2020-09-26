function* generate({
  population,
  reproduce,
  mutate,
  select,
  success,
  failure,
}) {
  for (
    let rank = 1;
    population.length > 0 && !failure({ rank, population });
    rank++
  ) {
    yield { rank, population };
    if (success({ rank, population })) break;
    mutate(population);
    const new_population = reproduce(population);
    population = select(new_population);
  }
}

const { sortBy } = require("lodash");

function select_best_percentile(population, survival_p_fn, percentile) {
  const competition = sortBy(population, [survival_p_fn]);
  const threshold = parseInt(population.length * percentile);
  return competition.slice(threshold);
}

module.exports = { generate, select_best_percentile };
