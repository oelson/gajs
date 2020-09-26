const { mutate_text } = require("./scenario/mutate_text");
const { stdout } = require("process");

const generations = mutate_text({
  start: {
    length: 100,
    function: "random_fixed_length",
  },
  reproduction: {
    rate: 20,
    function: "clone",
  },
  selection: {
    evaluation: "evaluate_phenotype",
    reduction: "keep_population_stable",
  },
  target: {
    alphabet: "abcdefghijklmnopqrstuvwxyz ",
    text: "le cadavre exquis boira le vin nouveau",
  },
  mutations: {
    functions: {
      insert_letter: 1,
      remove_letter: 1,
      replace_letter: 10,
      insert_byte: 0,
      remove_byte: 0,
      replace_byte: 0,
      alter_byte: 0,
    },
    maximum_per_cycle: 3,
  },
  stop: {
    rank: 10000,
    success: ["stop_when_survival_is_certain"],
    failure: ["stop_at_maximum_rank"],
  },
});

let final;
for (const { rank, population } of generations) {
  const best = population[population.length - 1];
  const worst = population[0];
  const best_survival = best.survival_p.toFixed(2);
  const worst_survival = worst.survival_p.toFixed(2);
  const summary = `[${rank}] s:${population.length} f:${best_survival}-${worst_survival} b:"${best.phenotype}" (0x${best.genotype_byte_string})`;
  stdout.write("\r");
  stdout.write(summary);
  final = best;
}

stdout.write("\n");

const chain = [];
for (
  let being = final;
  being && being.ancestors[0];
  being = being.ancestors[0]
) {
  chain.push(being);
}
chain.reverse();

console.log(chain[0].phenotype);
for (let i = 0; i < chain.length - 1; i++) {
  const j = i + 1;
  const f = chain[i];
  const s = chain[j];
  const d_p = s.survival_p - f.survival_p;
  let d = d_p.toFixed(2);
  if (d[0] !== "-") d = "+" + d;
  console.log(s.phenotype, d, `(${s.survival_p.toFixed(2)})`);
}
