class Being {
  constructor(genotype, phenotype) {
    this.initial_genotype = genotype.slice();
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

module.exports = { Being };
