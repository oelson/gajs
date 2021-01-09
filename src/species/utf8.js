const random = require("random");
const { StringDecoder } = require("string_decoder");

const Utf8Decoder = new StringDecoder("utf8");

function encode_utf8(s) {
  let i = 0,
    bytes = new Array(s.length * 4);
  for (let ci = 0; ci != s.length; ci++) {
    let c = s.charCodeAt(ci);
    if (c < 128) {
      bytes[i++] = c;
      continue;
    }
    if (c < 2048) {
      bytes[i++] = (c >> 6) | 192;
    } else {
      if (c > 0xd7ff && c < 0xdc00) {
        if (++ci >= s.length)
          throw new Error("UTF-8 encode: incomplete surrogate pair");
        let c2 = s.charCodeAt(ci);
        if (c2 < 0xdc00 || c2 > 0xdfff)
          throw new Error(
            "UTF-8 encode: second surrogate character 0x" +
              c2.toString(16) +
              " at index " +
              ci +
              " out of range"
          );
        c = 0x10000 + ((c & 0x03ff) << 10) + (c2 & 0x03ff);
        bytes[i++] = (c >> 18) | 240;
        bytes[i++] = ((c >> 12) & 63) | 128;
      } else bytes[i++] = (c >> 12) | 224;
      bytes[i++] = ((c >> 6) & 63) | 128;
    }
    bytes[i++] = (c & 63) | 128;
  }
  return bytes.slice(0, i);
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

function insert_letter(text, insertion_index, alphabet, alphabet_index) {
  const letters = text.split("");
  const new_letter = alphabet[alphabet_index];
  letters.splice(insertion_index, 0, new_letter);
  const new_text = letters.join("");
  return new_text;
}

function insert_random_letter(text, alphabet) {
  const insertion_index = random.int(0, text.length - 1);
  const alphabet_index = random.int(0, alphabet.length - 1);
  return insert_letter(text, insertion_index, alphabet, alphabet_index);
}

function remove_letter(text, removal_index) {
  const letters = text.split("");
  letters.splice(removal_index, 1);
  const new_text = letters.join("");
  return new_text;
}

function remove_random_letter(text) {
  const removal_index = random.int(0, text.length - 1);
  return remove_letter(text, removal_index);
}

function utf8_being(genotype) {
  const buffer = Buffer.from(genotype);
  const phenotype = Utf8Decoder.end(buffer);
  return { genotype, phenotype };
}

function utf8_target(phenotype) {
  const genotype = encode_utf8(phenotype);
  return utf8_being(genotype);
}

function random_text_being_of_random_length(alphabet, max_length) {
  const length = random.int(0, max_length);
  return random_text_being_of_fixed_length(alphabet, length);
}

function random_text_being_of_fixed_length(alphabet, length) {
  const phenotype = random_text(length, alphabet);
  const genotype = encode_utf8(phenotype);
  return utf8_being(genotype);
}

function random_text(length, alphabet) {
  let chars = [];
  for (var i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    const randomChar = alphabet.charAt(randomIndex);
    chars.push(randomChar);
  }
  return chars.join("");
}

module.exports = {
  utf8_being,
  utf8_target,
  encode_utf8,
  replace_random_letter,
  insert_random_letter,
  remove_random_letter,
  random_text_being_of_random_length,
  random_text_being_of_fixed_length
};
