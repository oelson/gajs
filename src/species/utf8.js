const {
  str_distance,
  byte_vector_distance,
} = require("../genetic_algorithm/selection");
const random = require("random");
const { StringDecoder } = require("string_decoder");

const Utf8Decoder = new StringDecoder("utf8");

function encode_utf8(s) {
  let i = 0,
    bytes = new Uint8Array(s.length * 4);
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
  return bytes.subarray(0, i);
}

class Utf8Being {
  constructor(genotype) {
    const buffer = Buffer.from(genotype);
    const phenotype = Utf8Decoder.end(buffer);

    this.initial_genotype = genotype.slice();
    this.genotype = genotype;
    this.phenotype = phenotype;
  }
}

class Utf8Target {
  constructor(text) {
    const genome = encode_utf8(text); // TODO python "replace" equivalent
    this.target = new Utf8Being(genome);
  }

  fitness_by_genotype(being) {
    return byte_vector_distance(being.genotype, this.target.genotype);
  }

  fitness_by_phenotype(being) {
    return str_distance(being.phenotype, this.target.phenotype);
  }

  random_being_from_alphabet(alphabet) {
    const phenotype = random_text(this.target.phenotype.length, alphabet);
    const genotype = encode_utf8(phenotype);
    return new Utf8Being(genotype);
  }

  random_being_from_bytes() {
    const genome = random_genome(this.target.genotype.length);
    return new Utf8Being(genome);
  }
}

function random_genome(length) {
  const genome = [];
  for (let i = 0; i < length; ++i) {
    const random_byte = random.int(0x00, 0xff);
    genome.push(random_byte);
  }
  return genome;
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

module.exports = { Utf8Being, Utf8Target, encode_utf8 };
