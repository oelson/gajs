function intToBase(int, base, length) {
  const coerced = int >>> 0; // https://stackoverflow.com/a/16155417/2950046
  const binary = coerced.toString(base);
  const padded = binary.padStart(length, "0");
  const lengthDiff = padded.length - length;
  const sized = padded.substring(lengthDiff);
  return sized;
}

function binary_string(bytes) {
  return bytes.map((b) => intToBase(b, 2, 8)).join("");
}

function byte_string(bytes) {
  return bytes.map((b) => intToBase(b, 16, 2)).join("");
}

module.exports = { binary_string, byte_string };
