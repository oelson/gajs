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

function select_by_threshold(survival_probability, survival_percentile) {
  return function (population) {
    const competition = sortBy(population, [survival_probability]);
    const threshold = parseInt(population.length * (1 - survival_percentile));
    return competition.slice(threshold);
  };
}

function stop_at_maximum_rank(maximum) {
  return ({ rank }) => rank > maximum;
}

function stop_at_certain_survival(survival_probability) {
  return ({ population }) => population.some((b) => survival_probability(b) === 1);
}

module.exports = {
  generate,
  select_by_threshold,
  stop_at_maximum_rank,
  stop_at_certain_survival,
};
