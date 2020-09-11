const { sortBy } = require("lodash");

function* generate({
  population,
  reproduce,
  mutate,
  fitness,
  survival_percentile,
  maximum_rank,
  target_fitness,
}) {
  let rank = 1;
  while (
    rank < maximum_rank &&
    population.length > 0 &&
    !population.some((b) => fitness(b) === target_fitness)
  ) {
    yield [rank, population];
    rank++;

    const all_lives = Array.from(life(population, mutate, reproduce));
    population = death(all_lives, fitness, survival_percentile);
  }
}

function* life(population, mutate, reproduce) {
  for (const being of population) {
    mutate(being);
    yield* reproduce(being, population);
  }
}

function death(population, fitness, survival_percentile) {
  // TODO arr.sort(fonctionComparaison)
  const competition = sortBy(population, [fitness]);
  const threshold = parseInt(population.length * survival_percentile);
  return competition.slice(0, threshold);
}

function last_generation(generations) {
  let rank, generation;
  for ([rank, generation] of generations) {
  }
  return rank, generation;
}

module.exports = { generate, last_generation };
