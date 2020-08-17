import { selection } from "./genetic_algorithm/selection";
import { Being } from "./genetic_algorithm/population";

export class TextBeing extends Being {
  constructor(genotype, encoding) {
    const phenotype = genotype.decode(encoding, "replace");
    super(genotype, phenotype);
    this.encoding = encoding;
  }
  reproduce(population) {
    genome_copy = bytearray(this.genotype);
    clone = TextBeing(genome_copy, this.encoding);
    return clone;
  }
}

export class TextTarget {
  constructor(text, encoding) {
    genome = bytearray(text.encode(encoding, "replace"));
    this.being = TextBeing(genome, encoding);
  }
  fitness_by_genotype(being) {
    return selection.bytearray_bit_distance(
      being.genotype,
      this.being.genotype
    );
  }
  fitness_by_phenotype(being) {
    return selection.letter_distance(being.phenotype, this.being.phenotype);
  }
  random_being(this) {
    genome = random_genome(len(this.being.genotype));
    return TextBeing(genome, this.being.encoding);
  }
  alphabet(this) {
    return list(set(this.being.phenotype));
  }
}

function random_genome(size) {
  // return bytearray(randint(0x00, 0xff) for _ in range(size))
}

function randint(min, max) {
  return parseInt(Math.round(Math.random() * (max - min) + min));
}
