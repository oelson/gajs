function integer_to_base(int, base, length) {
  const coerced = int >>> 0; // https://stackoverflow.com/a/16155417/2950046
  const binary = coerced.toString(base);
  const padded = binary.padStart(length, "0");
  const sized = padded.substring(0, length);
  return sized;
}

function binary_string(bytes) {
  return bytes.map((b) => integer_to_base(b, 2, 8)).join("");
}

function byte_string(bytes) {
  return bytes.map((b) => integer_to_base(b, 16, 2)).join("");
}

module.exports = { integer_to_base, binary_string, byte_string };
