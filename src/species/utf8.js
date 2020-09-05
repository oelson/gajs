const {
  str_distance,
  byte_vector_distance,
} = require("../genetic_algorithm/selection");
const { Being } = require("../genetic_algorithm/being");

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

function decode_utf8(bytes) {
  let i = 0,
    s = "";
  while (i < bytes.length) {
    let c = bytes[i++];
    if (c > 127) {
      if (c > 191 && c < 224) {
        if (i >= bytes.length)
          throw new Error("UTF-8 decode: incomplete 2-byte sequence");
        c = ((c & 31) << 6) | (bytes[i++] & 63);
      } else if (c > 223 && c < 240) {
        if (i + 1 >= bytes.length)
          throw new Error("UTF-8 decode: incomplete 3-byte sequence");
        c = ((c & 15) << 12) | ((bytes[i++] & 63) << 6) | (bytes[i++] & 63);
      } else if (c > 239 && c < 248) {
        if (i + 2 >= bytes.length)
          throw new Error("UTF-8 decode: incomplete 4-byte sequence");
        c =
          ((c & 7) << 18) |
          ((bytes[i++] & 63) << 12) |
          ((bytes[i++] & 63) << 6) |
          (bytes[i++] & 63);
      } else
        throw new Error(
          "UTF-8 decode: unknown multibyte start 0x" +
            c.toString(16) +
            " at index " +
            (i - 1)
        );
    }
    if (c <= 0xffff) s += String.fromCharCode(c);
    else if (c <= 0x10ffff) {
      c -= 0x10000;
      s += String.fromCharCode((c >> 10) | 0xd800);
      s += String.fromCharCode((c & 0x3ff) | 0xdc00);
    } else
      throw new Error(
        "UTF-8 decode: code point 0x" + c.toString(16) + " exceeds UTF-16 reach"
      );
  }
  return s;
}

class Utf8Being extends Being {
  constructor(genotype) {
    const phenotype = decode_utf8(genotype); // TODO python "replace" equivalent
    super(genotype, phenotype);
  }
  reproduce(population) {
    // reproduce by cloning
    const genome_copy = this.genotype.slice();
    const clone = new Utf8Being(genome_copy);
    return clone;
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
  random_being() {
    const genome = random_genome(this.target.genotype.length);
    return new Utf8Being(genome);
  }
}

function random_genome(size) {
  const genome = [];
  for (let i = 0; i < size; ++i) {
    const random_byte = randint(0x00, 0xff);
    genome.push(random_byte);
  }
  return genome;
}

function randint(min, max) {
  return parseInt(Math.round(Math.random() * (max - min) + min));
}

module.exports = { Utf8Being, Utf8Target, encode_utf8, decode_utf8 };
