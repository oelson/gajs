const { sortBy } = require("lodash");

function* generate({
  population,
  reproduce,
  mutate,
  fitness,
  survival_percentile,
  stop_conditions,
}) {
  let rank = 1;
  while (true) {
    yield { rank, population };
    rank++;

    if (
      population.length === 0 ||
      stop_conditions.some((f) => f({ rank, population }))
    )
      break;

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
    population = competition.slice(0, threshold);
  }
}

module.exports = { generate };
