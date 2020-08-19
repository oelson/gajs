class Being {
  constructor(genotype, phenotype) {
    this.initial_genotype = bytes(genotype);
    this.genotype = genotype;
    this.phenotype = phenotype;
  }
  reproduce(population) {
    return this;
  }

  toString() {
    return self.initial_genotype;
  }
}

function* generate(initial_population, lifecycle, stop) {
  let rank = 1;
  let population = initial_population;
  do {
    yield [rank, population];
    rank, (population = rank + 1), lifecycle(population);
  } while (!stop(rank, population));
}

module.exports = { Being, generate };
