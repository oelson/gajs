const {
  str_distance,
  byte_vector_distance,
} = require("../genetic_algorithm/selection");
const { Being } = require("../genetic_algorithm/being");

class TextBeing extends Being {
  constructor(genotype, encoding) {
    // TODO encode/decode equivalent
    const phenotype = genotype.decode(encoding, "replace");
    super(genotype, phenotype);
    this.encoding = encoding;
  }
  reproduce(population) {
    // TODO encode/decode equivalent
    genome_copy = bytearray(this.genotype);
    clone = TextBeing(genome_copy, this.encoding);
    return clone;
  }
}

class TextTarget {
  constructor(text, encoding) {
    // TODO encode/decode equivalent
    genome = bytearray(text.encode(encoding, "replace"));
    this.target = TextBeing(genome, encoding);
  }
  fitness_by_genotype(being) {
    return byte_vector_distance(being.genotype, this.target.genotype);
  }
  fitness_by_phenotype(being) {
    return str_distance(being.phenotype, this.target.phenotype);
  }
  random_being(this) {
    const genome = random_genome(this.target.genotype.length);
    return TextBeing(genome, this.target.encoding);
  }
  alphabet(this) {
    return list(set(this.target.phenotype));
  }
}

function random_genome(size) {
  const genome = [];
  for (let i = 0; i < size; ++i) {
    const random_byte = randint(0x00, 0xff);
    genome.push(random_byte);
  }
  return genome;
}

function randint(min, max) {
  return parseInt(Math.round(Math.random() * (max - min) + min));
}

module.exports = { TextBeing, TextTarget };
