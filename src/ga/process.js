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

module.exports = { generate }
