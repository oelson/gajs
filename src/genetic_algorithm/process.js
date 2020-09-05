const { sortBy } = require("lodash");

function truncate(population, fitness, survival_percentile) {
  const competition = sortBy(population, [fitness]);
  const threshold = parseInt(population.length * survival_percentile);
  return competition.slice(0, threshold);
}

function* generate(initial_population, lifecycle, stop) {
  let rank = 1;
  let population = initial_population;
  while (!stop(rank, population)) {
    yield [rank, population];
    rank++;
    population = lifecycle(population);
  }
}

class Simulation {
  constructor(
    survival_percentile,
    fitness,
    initiate_being,
    initial_population_size,
    hazard,
    maximum_rank
  ) {
    this.survival_percentile = survival_percentile;
    this.fertility_rate = parseInt(1 / survival_percentile);
    this.initiate_being = initiate_being;
    this.initial_population_size = initial_population_size;
    this.maximum_rank = maximum_rank;
    this.fitness_function = fitness;
    this.fitness_cache = new Map();
    this.hazard = hazard;
  }

  fitness(being) {
    if (!this.fitness_cache.has(being)) {
      this.fitness_cache.set(being, this.fitness_function(being));
    }
    return this.fitness_cache.get(being);
  }
  select(population) {
    return truncate(population, this.fitness, this.survival_percentile);
  }
  stop(rank, population) {
    return (
      rank === this.maximum_rank ||
      population.length === 0 ||
      population.some((being) => this.fitness(being) == 0)
    );
  }
  life(being, population) {
    being.genotype = this.hazard(being.genotype);
    const offspring = [];
    for (let i = 0; i < this.fertility_rate; ++i) {
      const child = being.reproduce(population);
      offspring.push(child);
    }
    return offspring;
  }
  lifecycle(population) {
    const descendants = [];
    for (const being of population) {
      const offspring = this.life(being, population);
      for (const child of offspring) {
        all_offsprings.push(child);
      }
    }
    return this.select(descendants);
  }
  generations() {
    const initial_population = [];
    for (let i = 0; i < this.initial_population_size; ++i) {
      const being = this.initiate_being();
      initial_population.push(being);
    }
    return generate(initial_population, this.lifecycle, this.stop);
  }
  last_generation() {
    const generations = this.generations();
    let rank, generation;
    for ([rank, generation] of generations) {
    }
    return rank, generation;
  }
}

module.exports = { generate, truncate, Simulation };
