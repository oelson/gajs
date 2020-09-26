const { sortBy } = require("lodash");

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

function keep_best_percentile(population, evaluate_being, survival_percentile) {
  const competition = sortBy(population, [evaluate_being]);
  const threshold = parseInt(population.length * (1 - survival_percentile));
  return competition.slice(threshold);
}

module.exports = {
  generate,
  keep_best_percentile,
};
