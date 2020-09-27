const { mutate_text } = require("./scenario/mutate_text");
const { stdout } = require("process");
const { relative_fixed } = require("./presentation");

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
    text: "le cadavre",
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

console.log("---- Evolution ----");
let final;
for (const { rank, population } of generations) {
  const best = population[population.length - 1];
  const worst = population[0];
  const best_survival = best.survival_p.toFixed(2);
  const worst_survival = worst.survival_p.toFixed(2);
  const summary = `[${rank}] s:${population.length} p:${best_survival}-${worst_survival} b:"${best.phenotype}" (0x${best.genotype_byte_string})`;
  console.log(summary);
  final = best;
}

console.log("---- Genealogy ----");

function* make_genealogy(final_being) {
  const chain = [];
  for (
    let being = final_being;
    being && being.ancestors[0];
    being = being.ancestors[0]
  ) {
    chain.push(being);
  }

  yield { delta: undefined, being: chain[chain.length - 1] };
  for (let i = chain.length - 1; i > 0; i--) {
    const last = chain[i];
    const previous = chain[i - 1];
    const delta = previous.survival_p - last.survival_p;
    yield { delta, being: previous };
  }
}

const genealogy = make_genealogy(final);

for (const { delta, being } of genealogy) {
  console.log(
    relative_fixed(delta, 2).padStart(5, " "),
    `(${being.survival_p.toFixed(2)})`,
    `"${being.phenotype}"`
  );
}
