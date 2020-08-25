const utf8 = require('./unicode/utf8');
const { flip_random_bit_in_random_byte } = require('./genetic_algorithm/mutation');

let input = "cadavre";
console.log(input);
for (let i = 0; i < 3; ++i) {
  let bytes = utf8.encode(input);
  flip_random_bit_in_random_byte(bytes);
  let output = utf8.decode(bytes);

  console.log(output);
  input = output;
}
