const { Given, When, Then } = require("cucumber");
const assert = require("assert");
const {
  flip_bit_in_byte,
  flip_bit_in_bytes,
} = require("../../../src/genetic_algorithm/mutation");
const {
  integer_to_base,
  binary_string,
} = require("../../../src/genetic_algorithm/presentation");

/** Manipulatio d'un octet
 */
Given("l'octet {string}", function (binary) {
  this.byte = parseInt(binary, 2);
});

When("j'inverse le bit de position {int} de l'octet", function (pos) {
  this.byte = flip_bit_in_byte(this.byte, pos);
});

Then("la représentation binaire de l'octet est {string}", function (expectedBinary) {
  const actualBinary = integer_to_base(this.byte, 2, 8);
  assert.equal(expectedBinary, actualBinary);
});

/** Manipulatio d'un vecteur d'octets
 */
function parseByteVector(string) {
  return string.split(",").map((x) => parseInt(x));
}

Given("un vecteur d'octets {string}", function (vector) {
  this.vector = parseByteVector(vector);
});

When(
  "j'inverse le bit de position {int} de l'octet de position {int}",
  function (bitPos, bytePos) {
    flip_bit_in_bytes(this.vector, bytePos, bitPos);
  }
);

Then("la représentation binaire du vecteur d'octets est {string}", function (expectedBin) {
  const actualBin = binary_string(this.vector);
  assert.equal(actualBin, expectedBin);
});
