export class Being {
  constructor(genotype, phenotype) {
    this.initial_genotype = bytes(genotype);
    this.genotype = genotype;
    this.phenotype = phenotype;
  }
  reproduce(population) {
    return this;
  }
  /*
def __hash__(self):
    return hash(self.initial_genotype)

def __eq__(self, other):
    return self.initial_genotype == other.initial_genotype
*/
}

export function* generate(initial_population, lifecycle, stop) {
  let rank = 1;
  let population = initial_population;
  yield [rank, population];
  while (!stop(rank, population)) {
    rank, (population = rank + 1), lifecycle(population);
    yield [rank, population];
  }
}
