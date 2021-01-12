const { byte_string } = require("./presentation")
const { distance: levenshtein } = require("fastest-levenshtein")
const {
  flip_random_bit_in_random_byte,
  replace_random_byte,
  insert_random_byte,
  remove_random_byte,
} = require("./bytes")
const { generate, hazard } = require("./process")
const { sortBy } = require("lodash")
const random = require("random")
const { StringDecoder } = require("string_decoder")

const Utf8Decoder = new StringDecoder("utf8")

function encode_utf8(s) {
  let i = 0,
    bytes = new Array(s.length * 4)
  for (let ci = 0; ci != s.length; ci++) {
    let c = s.charCodeAt(ci)
    if (c < 128) {
      bytes[i++] = c
      continue
    }
    if (c < 2048) {
      bytes[i++] = (c >> 6) | 192
    } else {
      if (c > 0xd7ff && c < 0xdc00) {
        if (++ci >= s.length)
          throw new Error("UTF-8 encode: incomplete surrogate pair")
        let c2 = s.charCodeAt(ci)
        if (c2 < 0xdc00 || c2 > 0xdfff)
          throw new Error(
            "UTF-8 encode: second surrogate character 0x" +
              c2.toString(16) +
              " at index " +
              ci +
              " out of range"
          )
        c = 0x10000 + ((c & 0x03ff) << 10) + (c2 & 0x03ff)
        bytes[i++] = (c >> 18) | 240
        bytes[i++] = ((c >> 12) & 63) | 128
      } else bytes[i++] = (c >> 12) | 224
      bytes[i++] = ((c >> 6) & 63) | 128
    }
    bytes[i++] = (c & 63) | 128
  }
  return bytes.slice(0, i)
}

function utf8_being(genotype) {
  const buffer = Buffer.from(genotype)
  const phenotype = Utf8Decoder.end(buffer)
  return { genotype, phenotype }
}

function mutate_text(conf) {
  const choices = {
    mutation: {
      insert_letter(being) {
        const insertion_index = random.int(0, being.phenotype.length - 1)
        const alphabet_index = random.int(0, conf.target.alphabet.length - 1)
        const letters = being.phenotype.split("")
        const new_letter = conf.target.alphabet[alphabet_index]
        letters.splice(insertion_index, 0, new_letter)
        const new_phenotype = letters.join("")
        being.genotype = encode_utf8(new_phenotype)
      },
      remove_letter(being) {
        const removal_index = random.int(0, being.phenotype.length - 1)
        const letters = being.phenotype.split("")
        letters.splice(removal_index, 1)
        const new_phenotype = letters.join("")
        being.genotype = encode_utf8(new_phenotype)
      },
      replace_letter(being) {
        const replacement_index = random.int(0, being.phenotype.length - 1)
        const alphabet_index = random.int(0, conf.target.alphabet.length - 1)
        const letters = being.phenotype.split("")
        const new_letter = conf.target.alphabet[alphabet_index]
        letters[replacement_index] = new_letter
        const new_phenotype = letters.join("")
        being.genotype = encode_utf8(new_phenotype)
      },
      insert_byte(being) {
        insert_random_byte(being.genotype)
      },
      remove_byte(being) {
        remove_random_byte(being.genotype)
      },
      replace_byte(being) {
        replace_random_byte(being.genotype)
      },
      alter_byte(being) {
        flip_random_bit_in_random_byte(being.genotype)
      },
    },
    evaluation: {
      text_distance(being) {
        const score = levenshtein(being.phenotype, target_b.phenotype)
        const death_probability = score / target_b.phenotype.length
        return 1 - death_probability
      },
      bytes_distance(being) {
        // workaround...
        const being_genotype_string = being.genotype_byte_string
        const target_genotype_string = target_b.genotype_byte_string
        const score = levenshtein(being_genotype_string, target_genotype_string)
        const death_probability = score / target_genotype_string.length
        return 1 - death_probability
      },
    },
    selection: {
      keep_population_stable(population) {
        const competition = sortBy(population, [(b) => b.survival_p])
        const percentile = 1 - 1 / conf.reproduction.rate
        const threshold = parseInt(population.length * percentile)
        return competition.slice(threshold)
      },
    },
    population: {
      random_fixed_length() {
        let chars = []
        for (var i = 0; i < target_b.phenotype.length; i++) {
          const randomIndex = Math.floor(
            Math.random() * conf.target.alphabet.length
          )
          const randomChar = conf.target.alphabet.charAt(randomIndex)
          chars.push(randomChar)
        }
        const phenotype = chars.join("")
        const genotype = encode_utf8(phenotype)
        return utf8_being(genotype)
      },
    },
    reproduction: {
      clone(being) {
        const genome_copy = being.genotype.slice()
        return utf8_being(genome_copy)
      },
    },
  }

  const hazard_fn = hazard(
    choices.mutation,
    conf.mutations.functions,
    conf.mutations.number_per_cycle
  )
  const initial_population_fn = choices.population[conf.start.function]
  const target_b = utf8_being(encode_utf8(conf.target.text))
  const survival_p_fn = choices.evaluation[conf.selection.evaluation]
  const select_fn = choices.selection[conf.selection.reduction]
  const reproduction_fn = choices.reproduction[conf.reproduction.function]

  function success({ population }) {
    return population.some((being) => being.survival_p >= conf.stop.survival_p)
  }

  function failure({ rank }) {
    return rank > conf.stop.rank
  }

  function label(being, ancestors) {
    being.survival_p = survival_p_fn(being)
    being.ancestors = ancestors
    being.genotype_byte_string = byte_string(being.genotype)
  }

  function initial_population() {
    const population = []
    for (let i = 0; i < conf.start.length; i++) {
      const being = initial_population_fn()
      label(being, [])
      population.push(being)
    }
    return population
  }

  function reproduce(population) {
    const offspring = []
    for (const parent of population) {
      for (let i = 0; i < conf.reproduction.rate; i++) {
        const child = reproduction_fn(parent)
        label(child, [parent])
        offspring.push(child)
      }
    }
    return offspring
  }

  const generations = generate({
    population: initial_population(),
    mutate: (p) => p.forEach(hazard_fn),
    reproduce: reproduce,
    select: select_fn,
    success,
    failure,
  })

  return generations
}

module.exports = { mutate_text }
