const { sortBy } = require("lodash");

function* generate({
  population,
  reproduce,
  mutate,
  fitness,
  survival_percentile,
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
    population = evolve(
      population,
      mutate,
      reproduce,
      fitness,
      survival_percentile
    );
  }
}

function evolve(population, mutate, reproduce, fitness, survival_percentile) {
  // hazard: mutate each being
  for (const being of population) {
    mutate(being);
  }

  // life: new beings by reproduction
  // do not put previous beings in descendants (lifetime of 1) in order to keep the population stable
  const descendants = population
    .map((being) => reproduce(being, population))
    .reduce((_population, offspring) => _population.concat(offspring), []);

  // death: kill less-adapted beings
  const competition = sortBy(descendants, [fitness]);
  const threshold = parseInt(descendants.length * survival_percentile);
  const new_population = competition.slice(0, threshold);
  return new_population;
}

function stop_at_maximum_rank(maximum) {
  return ({ rank }) => rank > maximum;
}

function stop_at_target_fitness(target, fitness) {
  return ({ population }) => population.some((b) => fitness(b) === target);
}

module.exports = { generate, stop_at_maximum_rank, stop_at_target_fitness };
