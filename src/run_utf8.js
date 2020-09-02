const { Utf8Being, Utf8Target } = require("./species/utf8");
const {
  binary_string,
  byte_string,
} = require("./genetic_algorithm/presentation");
const { flip_bit_in_byte } = require("./genetic_algorithm/mutation");

const t = new Utf8Target("le cadavre exquis boira le vin nouveau");
const b = t.target.reproduce();
const mutationIndex = 12;
const originalByte = b.genotype[mutationIndex];
const newByte = flip_bit_in_byte(originalByte, 3);
b.genotype[mutationIndex] = newByte;

const f = t.fitness_by_genotype(b);
//console.log(f);
