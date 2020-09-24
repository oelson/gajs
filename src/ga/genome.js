const random = require("random");

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

function insert_random_byte(bytes) {
  const new_byte = random.int(0x00, 0xff);
  const byte_index = random.int(0, bytes.length - 1);
  bytes.splice(byte_index, 0, new_byte);
}

function remove_random_byte(bytes) {
  const byte_index = random.int(0, bytes.length - 1);
  bytes.splice(byte_index, 1);
}

function replace_random_byte(bytes) {
  const new_byte = random.int(0x00, 0xff);
  const byte_index = random.int(0, bytes.length - 1);
  bytes[byte_index] = new_byte;
}

function random_genome(length) {
  const genome = [];
  for (let i = 0; i < length; ++i) {
    const random_byte = random.int(0x00, 0xff);
    genome.push(random_byte);
  }
  return genome;
}

module.exports = {
  flip_random_bit_in_random_byte,
  replace_random_byte,
  insert_random_byte,
  remove_random_byte,
  random_genome,
};
