const { relative_fixed, byte_string } = require("./presentation");
const { distance: levenshtein } = require("fastest-levenshtein");
const { hazard } = require("./hazard");
const {
  flip_random_bit_in_random_byte,
  replace_random_byte,
  insert_random_byte,
  remove_random_byte,
} = require("./bytes");
const { generate } = require("./process");
const { sortBy } = require("lodash");
const random = require("random");
const { StringDecoder } = require("string_decoder");

const Utf8Decoder = new StringDecoder("utf8");

function encode_utf8(s) {
  let i = 0,
    bytes = new Array(s.length * 4);
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
  return bytes.slice(0, i);
}

function replace_letter(text, replacement_index, alphabet, alphabet_index) {
  const letters = text.split("");
  const new_letter = alphabet[alphabet_index];
  letters[replacement_index] = new_letter;
  const new_text = letters.join("");
  return new_text;
}

function replace_random_letter(text, alphabet) {
  const replacement_index = random.int(0, text.length - 1);
  const alphabet_index = random.int(0, alphabet.length - 1);
  return replace_letter(text, replacement_index, alphabet, alphabet_index);
}

function insert_letter(text, insertion_index, alphabet, alphabet_index) {
  const letters = text.split("");
  const new_letter = alphabet[alphabet_index];
  letters.splice(insertion_index, 0, new_letter);
  const new_text = letters.join("");
  return new_text;
}

function insert_random_letter(text, alphabet) {
  const insertion_index = random.int(0, text.length - 1);
  const alphabet_index = random.int(0, alphabet.length - 1);
  return insert_letter(text, insertion_index, alphabet, alphabet_index);
}

function remove_letter(text, removal_index) {
  const letters = text.split("");
  letters.splice(removal_index, 1);
  const new_text = letters.join("");
  return new_text;
}

function remove_random_letter(text) {
  const removal_index = random.int(0, text.length - 1);
  return remove_letter(text, removal_index);
}

function utf8_being(genotype) {
  const buffer = Buffer.from(genotype);
  const phenotype = Utf8Decoder.end(buffer);
  return { genotype, phenotype };
}

function utf8_target(phenotype) {
  const genotype = encode_utf8(phenotype);
  return utf8_being(genotype);
}

function random_text_being_of_random_length(alphabet, max_length) {
  const length = random.int(0, max_length);
  return random_text_being_of_fixed_length(alphabet, length);
}

function random_text_being_of_fixed_length(alphabet, length) {
  const phenotype = random_text(length, alphabet);
  const genotype = encode_utf8(phenotype);
  return utf8_being(genotype);
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

function mutate_text(conf) {
  const choices = {
    mutation: {
      insert_letter(being) {
        const new_phenotype = insert_random_letter(
          being.phenotype,
          conf.target.alphabet
        );
        being.genotype = encode_utf8(new_phenotype);
      },
      remove_letter(being) {
        const new_phenotype = remove_random_letter(being.phenotype);
        being.genotype = encode_utf8(new_phenotype);
      },
      replace_letter(being) {
        const new_phenotype = replace_random_letter(
          being.phenotype,
          conf.target.alphabet
        );
        being.genotype = encode_utf8(new_phenotype);
      },
      insert_byte(being) {
        insert_random_byte(being.genotype);
      },
      remove_byte(being) {
        remove_random_byte(being.genotype);
      },
      replace_byte(being) {
        replace_random_byte(being.genotype);
      },
      alter_byte(being) {
        flip_random_bit_in_random_byte(being.genotype);
      },
    },
    evaluation: {
      evaluate_phenotype(being) {
        const score = levenshtein(being.phenotype, target_b.phenotype);
        const death_probability = score / target_b.phenotype.length;
        return 1 - death_probability;
      },
      evaluate_genotype(being) {
        // workaround...
        const being_genotype_string = being.genotype_byte_string;
        const target_genotype_string = target_b.genotype_byte_string;
        const score = levenshtein(
          being_genotype_string,
          target_genotype_string
        );
        const death_probability = score / target_genotype_string.length;
        return 1 - death_probability;
      },
    },
    selection: {
      keep_population_stable(population) {
        const competition = sortBy(population, [(b) => b.survival_p]);
        const percentile = 1 - 1 / conf.reproduction.rate;
        const threshold = parseInt(population.length * percentile);
        return competition.slice(threshold);
      },
    },
    population: {
      random_fixed_length() {
        return random_text_being_of_fixed_length(
          conf.target.alphabet,
          target_b.phenotype.length
        );
      },
      random_variable_length() {
        return random_text_being_of_random_length(
          conf.target.alphabet,
          target_b.phenotype.length
        );
      },
    },
    reproduction: {
      clone(being) {
        const genome_copy = being.genotype.slice();
        return utf8_being(genome_copy);
      },
    },
  };

  const hazard_fn = hazard(
    choices.mutation,
    conf.mutations.functions,
    conf.mutations.number_per_cycle
  );
  const initial_population_fn = choices.population[conf.start.function];
  const target_b = utf8_target(conf.target.text);
  const survival_p_fn = choices.evaluation[conf.selection.evaluation];
  const select_fn = choices.selection[conf.selection.reduction];
  const reproduction_fn = choices.reproduction[conf.reproduction.function];

  function success({ population }) {
    return population.some((being) => being.survival_p >= conf.stop.survival_p);
  }

  function failure({ rank }) {
    return rank > conf.stop.rank;
  }

  function label(being, ancestors) {
    being.survival_p = survival_p_fn(being);
    being.ancestors = ancestors;
    being.genotype_byte_string = byte_string(being.genotype);
  }

  function initial_population() {
    const population = [];
    for (let i = 0; i < conf.start.length; i++) {
      const being = initial_population_fn();
      label(being, []);
      population.push(being);
    }
    return population;
  }

  function reproduce(population) {
    const offspring = [];
    for (const parent of population) {
      for (let i = 0; i < conf.reproduction.rate; i++) {
        const child = reproduction_fn(parent);
        label(child, [parent]);
        offspring.push(child);
      }
    }
    return offspring;
  }

  const generations = generate({
    population: initial_population(),
    mutate: (p) => p.forEach(hazard_fn),
    reproduce: reproduce,
    select: select_fn,
    success,
    failure,
  });

  return generations;
}

const generations = mutate_text({
  target: {
    alphabet: "abcdefghijklmnopqrstuvwxyz ",
    text: "les zebres sont des animaux tres fragiles",
  },
  start: {
    length: 100,
    function: "random_variable_length",
  },
  reproduction: {
    rate: 10,
    function: "clone",
  },
  selection: {
    evaluation: "evaluate_phenotype",
    reduction: "keep_population_stable",
  },
  mutations: {
    functions: {
      insert_letter: 1,
      remove_letter: 1,
      replace_letter: 2,
      insert_byte: 0,
      remove_byte: 0,
      replace_byte: 0,
      alter_byte: 0,
    },
    number_per_cycle: 1,
  },
  stop: {
    rank: 10000,
    survival_p: 0.97,
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

function* follow(element, next) {
  do {
    yield element;
    element = next(element);
  } while (element);
}

function* make_genealogy(final_being) {
  const chain = Array.from(follow(final_being, (b) => b.ancestors[0]));
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
