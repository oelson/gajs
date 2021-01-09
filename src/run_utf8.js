const { mutate_text } = require("./scenario/mutate_text");
const { relative_fixed } = require("./presentation");

const generations = mutate_text({
  target: {
    alphabet: "abcdefghijklmnopqrstuvwxyz ",
    text: "les zebres sont des animaux tres fragiles"
  },
  start: {
    length: 100,
    function: "random_variable_length"
  },
  reproduction: {
    rate: 10,
    function: "clone"
  },
  selection: {
    evaluation: "evaluate_phenotype",
    reduction: "keep_population_stable"
  },
  mutations: {
    functions: {
      insert_letter: 1,
      remove_letter: 1,
      replace_letter: 2,
      insert_byte: 0,
      remove_byte: 0,
      replace_byte: 0,
      alter_byte: 0
    },
    number_per_cycle: 1
  },
  stop: {
    rank: 10000,
    survival_p: 0.97
  }
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

function* follow(element, next) {
  do {
    yield element;
    element = next(element);
  } while (element);
}

function* make_genealogy(final_being) {
  const chain = Array.from(follow(final_being, b => b.ancestors[0]));
  chain.reverse();

  yield { delta: undefined, being: chain[0] };
  for (let i = 0; i < chain.length - 1; i++) {
    const current = chain[i];
    const next = chain[i + 1];
    const delta = next.survival_p - current.survival_p;
    yield { delta, being: next };
  }
}

for (const { delta, being } of make_genealogy(final)) {
  console.log(
    relative_fixed(delta, 2).padStart(5, " "),
    `(${being.survival_p.toFixed(2)})`,
    `"${being.phenotype}"`
  );
}
