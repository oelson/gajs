const random = require("random");

function flip_bit_in_byte(byte, n) {
  const mask = 1 << n;
  const byte_ = byte ^ mask;
  return byte_;
}

function flip_random_bit_in_byte(byte) {
  const n = random.int(0, 8);
  return flip_bit_in_byte(byte, n);
}

function flip_random_bit_in_bytes(bytes, n) {
  const byte = bytes[n];
  const byte_ = flip_random_bit_in_byte(byte);
  bytes[n] = byte_;
}

function flip_random_bit_in_random_byte(bytes) {
  const n = random.int(0, bytes.length);
  flip_random_bit_in_bytes(bytes, n);
}

module.exports = { flip_random_bit_in_random_byte };
