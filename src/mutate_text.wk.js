const { mutate_text } = require("./ga/text")

onmessage = function(e) {
  const conf = e.data
  const generations = mutate_text(conf)
  for (const { rank, population } of generations) {
    const best = population[population.length - 1]
    const worst = population[0]
    const population_length = population.length
    postMessage({ rank, best, worst, population_length })
  }
  postMessage(null)
}
