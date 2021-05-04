const { byte_string } = require("./presentation")
const { distance: levenshtein } = require("fastest-levenshtein")
const {
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
      // output 1 byte
      bytes[i++] = c
    } else if (c < 2048) {
      // output 2 bytes
      bytes[i++] = (c >> 6) | 192
      bytes[i++] = (c & 63) | 128
    } else if (!(c > 0xd7ff && c < 0xdc00)) {
      // output 3 bytes
      bytes[i++] = (c >> 12) | 224
      bytes[i++] = ((c >> 6) & 63) | 128
      bytes[i++] = (c & 63) | 128
    } else {
      // rebuild code point from 2 contiguous UTF-16 code units
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
      // output 4 bytes
      bytes[i++] = (c >> 18) | 240
      bytes[i++] = ((c >> 12) & 63) | 128
      bytes[i++] = ((c >> 6) & 63) | 128
      bytes[i++] = (c & 63) | 128
    }
  }
  return bytes.slice(0, i)
}

function utf8_being(genotype) {
  const buffer = Buffer.from(genotype)
  const phenotype = Utf8Decoder.end(buffer)
  return { genotype, phenotype }
}

function counts(iterable) {
  const map = new Map()
  for (const element of iterable) {
    let count = map.get(element)
    if (count === undefined) count = 0
    map.set(element, count + 1)
  }
  return map
}

function compare_sets(a, b) {
  const all_letters = new Set([...a.keys(), ...b.keys()])
  let distance = 0
  for (const l of all_letters) {
    let a_count = a.get(l)
    let b_count = b.get(l)
    if (a_count === undefined) a_count = 0
    if (b_count === undefined) b_count = 0
    distance += Math.abs(a_count - b_count)
  }
  return distance
}

function mutate_text(conf) {
  const alphabet =
    typeof conf.target.alphabet.length > 0
      ? conf.target.alphabet
      : [...new Set(conf.target.text.split(""))].join("")
  const choices = {
    mutation: {
      insert_letter(being) {
        const insertion_index = random.int(0, being.phenotype.length - 1)
        const alphabet_index = random.int(0, alphabet.length - 1)
        const letters = being.phenotype.split("")
        const new_letter = alphabet[alphabet_index]
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
        const alphabet_index = random.int(0, alphabet.length - 1)
        const letters = being.phenotype.split("")
        const new_letter = alphabet[alphabet_index]
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
    },
    evaluation: {
      text_distance(being) {
        const distance = levenshtein(being.phenotype, target_b.phenotype)
        const max = target_b.phenotype.length
        const death_probability = distance / max
        const survival_probability = 1 - death_probability
        return survival_probability
      },
      text_unsorted_distance(being) {
        const distance = compare_sets(
          being.phenotype_counts,
          target_b.phenotype_counts
        )
        const max = Math.max(being.phenotype.length, target_b.phenotype.length)
        const death_probability = distance / max
        const survival_probability = 1 - death_probability
        return survival_probability
      },
      bytes_distance(being) {
        // workaround...
        const score = levenshtein(
          being.genotype_byte_string,
          target_b.genotype_byte_string
        )
        const death_probability = score / target_b.genotype_byte_string.length
        const survival_probability = 1 - death_probability
        return survival_probability
      },
    },
    population: {
      random_letter() {
        let chars = []

        const randomIndex = Math.floor(Math.random() * alphabet.length)
        const randomChar = alphabet.charAt(randomIndex)
        chars.push(randomChar)

        const phenotype = chars.join("")
        const genotype = encode_utf8(phenotype)
        return utf8_being(genotype)
      },
      random_text() {
        let chars = []
        for (var i = 0; i < target_b.phenotype.length; i++) {
          const randomIndex = Math.floor(Math.random() * alphabet.length)
          const randomChar = alphabet.charAt(randomIndex)
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
      couple(being, population) {
        let mate = null
        for (let i = 0; i < 10 && (mate === null || mate === being); ++i) {
          const mi = random.int(0, population.length - 1)
          mate = population[mi]
        }
        const fold_at = random.int(0, being.genotype.length)
        const recombined_genome = []
        for (let fi = 0; fi < being.genotype.length; fi++) {
          const genitor = fi <= fold_at ? being : mate
          const byte = genitor.genotype[fi]
          recombined_genome.push(byte)
        }
        return utf8_being(recombined_genome)
      },
    },
  }

  const hazard_fn = hazard(
    choices.mutation,
    conf.mutations.functions,
    conf.mutations.rate
  )
  const initial_population_fn = choices.population[conf.start.function]
  const target_b = utf8_being(encode_utf8(conf.target.text))
  const survival_p_fn = choices.evaluation[conf.selection.evaluation]
  const reproduction_fn = choices.reproduction[conf.reproduction.function]

  function success({ population }) {
    return population.some((being) => being.survival_p >= conf.stop.survival_p)
  }

  function failure({ rank, population }) {
    return (
      rank > conf.stop.rank || population.some((being) => being.survival_p <= 0)
    )
  }

  function label(being) {
    // beware order is important
    being.genotype_byte_string = byte_string(being.genotype)
    being.phenotype_counts = counts(being.phenotype)
    being.survival_p = survival_p_fn(being)
  }

  function initial_population() {
    const population = []
    for (let i = 0; i < conf.start.length; i++) {
      const being = initial_population_fn()
      label(being)
      population.push(being)
    }
    return population
  }

  function reproduce(population) {
    const offspring = []
    for (const parent of population) {
      for (let i = 0; i < conf.reproduction.rate; i++) {
        const child = reproduction_fn(parent, population)
        label(child)
        offspring.push(child)
      }
    }
    return offspring
  }

  function keep_population_stable(population) {
    const competition = sortBy(population, [(b) => b.survival_p])
    const percentile = 1 - 1 / conf.reproduction.rate
    const threshold = parseInt(population.length * percentile)
    return competition.slice(threshold)
  }

  label(target_b)

  const generations = generate({
    population: initial_population(),
    mutate: (p) => p.forEach(hazard_fn),
    reproduce: reproduce,
    select: keep_population_stable,
    success,
    failure,
  })

  return generations
}

module.exports = { mutate_text, encode_utf8 }
