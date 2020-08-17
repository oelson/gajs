/*
from random import choice, choices, randint
from typing import Dict, Callable, Sequence
Mutation = Callable[[bytearray], bytearray]
*/

export class Hazard {
  constructor(this, distribution, maximum) {
    this.distribution = distribution;
    this.maximum = maximum;
  }
  __call__(genotype) {
    for (const mutation of this.pick()) {
      genotype = mutation(genotype);
    }
    return genotype;
  }
  pick() {
    return choices(
      (population = list(this.distribution.keys())),
      (weights = list(this.distribution.values())),
      (k = this.maximum)
    );
  }
}

export function hazard(
  mutation_probability,
  mutation_distribution,
  maximum_number_of_mutations
) {
  map_mutation_probability = {
    /*
        mutation: mutation_probability * inner_probability
        for mutation, inner_probability in mutation_distribution.items()
        */
  };

  if (mutation_probability < 1)
    map_mutation_probability[_no_mutation] = 1 - mutation_probability;

  return Hazard(map_mutation_probability, maximum_number_of_mutations);
}

export function replace_random_byte(genotype) {
  index = _random_byte_index(genotype);
  genotype[index] = randint(0x00, 0xff);
  return genotype;
}

export function replace_random_bit(genotype) {
  byte_index = _random_byte_index(genotype);
  byte = genotype[byte_index];
  bit_index = _random_bit_index_in_byte();
  mutated_byte = byte ^ (1 << bit_index);
  genotype[byte_index] = mutated_byte;
  return genotype;
}

export function replace_random_letter(alphabet) {
  return function (genotype) {
    text = genotype.decode("UTF-8", "replace");
    new_text = _mutate_random_letter(text, alphabet);
    new_genome = new_text.encode("UTF-8", "replace");
    return bytearray(new_genome);
  };
}

function _no_mutation(genotype) {
  return genotype;
}

function _random_byte_index(genotype) {
  return randint(0, len(genotype) - 1);
}

function _random_bit_index_in_byte() {
  return randint(0, 7);
}

function _mutate_random_letter(text, alphabet) {
  letters = list(text);
  index = randint(0, len(letters) - 1);
  new_letter = choice(alphabet);
  letters[index] = new_letter;
  new_text = "".join(letters);
  return new_text;
}
