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

// https://stackoverflow.com/questions/34309988/byte-array-to-hex-string-conversion-in-javascript
function byte_string(byteArray) {
  const chars = new Uint8Array(byteArray.length * 2);
  const alpha = "a".charCodeAt(0) - 10;
  const digit = "0".charCodeAt(0);

  let p = 0;
  for (let i = 0; i < byteArray.length; i++) {
    let nibble = byteArray[i] >>> 4;
    chars[p++] = nibble > 9 ? nibble + alpha : nibble + digit;
    nibble = byteArray[i] & 0xf;
    chars[p++] = nibble > 9 ? nibble + alpha : nibble + digit;
  }

  return String.fromCharCode.apply(null, chars);
}

function summarize_generation(rank, population) {
  const [best, best_survival_p] = population[population.length - 1];
  const [worst, worst_survival_p] = population[0];
  const best_survival = best_survival_p.toFixed(2);
  const worst_survival = worst_survival_p.toFixed(2);
  return `[${rank}] s:${
    population.length
  } f:${best_survival}-${worst_survival} b:"${best.phenotype}" (0x${byte_string(
    best.genotype
  )})`;
}

module.exports = {
  integer_to_base,
  binary_string,
  byte_string,
  summarize_generation,
};
