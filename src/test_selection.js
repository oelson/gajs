const {
  letter_distance,
  letter_distance_diff,
} = require("./genetic_algorithm/selection");

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
