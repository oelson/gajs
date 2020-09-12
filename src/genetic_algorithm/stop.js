function maximum_rank(maximum) {
  return ({ rank }) => rank > maximum;
}

function target_fitness(target, fitness) {
  return ({ population }) => population.some((b) => fitness(b) === target);
}

module.exports = { maximum_rank, target_fitness };
