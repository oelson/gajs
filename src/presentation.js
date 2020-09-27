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

function relative_fixed(number, length) {
  if (number === undefined || number === null || isNaN(number)) {
    return "";
  }
  let s = number.toFixed(length);
  if (number === 0) {
    return " " + s;
  } else if (number > 0) {
    return "+" + s;
  } else {
    return s;
  }
}

module.exports = {
  integer_to_base,
  binary_string,
  byte_string,
  relative_fixed,
};
