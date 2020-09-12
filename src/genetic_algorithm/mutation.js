const random = require("random");
const { select } = require("weighted");

function flip_bit_in_byte(byte, bit_index) {
  const mask = 1 << bit_index;
  const new_byte = byte ^ mask;
  return new_byte;
}

function flip_bit_in_bytes(bytes, byte_index, bit_index) {
  const original_byte = bytes[byte_index];
  const new_byte = flip_bit_in_byte(original_byte, bit_index);
  bytes[byte_index] = new_byte;
}

function flip_random_bit_in_random_byte(bytes) {
  const bit_index = random.int(0, 7);
  const byte_index = random.int(0, bytes.length - 1);
  flip_bit_in_bytes(bytes, byte_index, bit_index);
}

function replace_letter(text, replacement_index, alphabet, alphabet_index) {
  const letters = text.split("");
  const new_letter = alphabet[alphabet_index];
  letters[replacement_index] = new_letter;
  const new_text = letters.join("");
  return new_text;
}

function replace_random_letter(text, alphabet) {
  const replacement_index = random.int(0, text.length - 1);
  const alphabet_index = random.int(0, alphabet.length - 1);
  return replace_letter(text, replacement_index, alphabet, alphabet_index);
}

function nothing(_) {
  return _;
}

class Hazard {
  constructor(mutations, weights, maximum) {
    this.mutations = mutations;
    this.weights = weights;
    this.maximum = maximum;
  }

  mutate(being) {
    for (const mutate of this.pick()) {
      mutate(being);
    }
  }

  *pick() {
    const times = random.int(1, this.maximum);
    for (let i = 1; i <= times; i++) {
      yield select(this.mutations, this.weights);
    }
  }
}

module.exports = {
  flip_bit_in_byte,
  flip_bit_in_bytes,
  flip_random_bit_in_random_byte,
  replace_letter,
  replace_random_letter,
  nothing,
  Hazard,
};
