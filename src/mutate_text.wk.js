const { mutate_text } = require("./ga/text")

onmessage = function(e) {
  const generations = mutate_text(e.data)
  for (const { rank, population } of generations) {
    const best = population[population.length - 1]
    const worst = population[0]
    const population_length = population.length
    postMessage({ rank, best, worst, population_length, end: false })
  }
  postMessage({ end: true })
}
