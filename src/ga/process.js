const { sortBy } = require("lodash");

function* generate({
  population,
  reproduce,
  mutate,
  select,
  success_conditions,
  fail_conditions,
}) {
  let rank = 1;
  while (
    population.length > 0 &&
    !fail_conditions.some((f) => f({ rank, population }))
  ) {
    yield { rank, population };
    if (success_conditions.some((f) => f({ rank, population }))) {
      break;
    }
    rank++;

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

function stop_at_maximum_rank(maximum) {
  return ({ rank }) => rank > maximum;
}

function stop_when_survival_is_certain(survival_probability) {
  return ({ population }) =>
    population.some((b) => survival_probability(b) === 1);
}

module.exports = {
  generate,
  keep_best_percentile,
  stop_at_maximum_rank,
  stop_when_survival_is_certain,
};
