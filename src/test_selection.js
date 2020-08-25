const {
  letter_distance,
  letter_distance_diff,
  bit_distance,
} = require("./genetic_algorithm/selection");

/*
const pairs = [
  ["abcxyz", "abcdef"], // 3
  //["azerty", "qsdfgh"], // 6
  //["le cadavre exquis boira le vin nouveau", "le ca!!vre exquiZ boir le vin nouv"], // 7 en diff
];

for (let [a, b] of pairs) {
  console.log(a);
  console.log(b);
  console.log("letter_distance", letter_distance(a, b));
  console.log("letter_distance_diff", letter_distance_diff(a, b));
  console.log('--------------')
}
*/

/*
const a = 456;
const b = 1497;

console.log(a.toString(2).padStart(11, "0"));
console.log(b.toString(2));
console.log(bit_distance(a, b, 32));
*/