/*
from difflib import ndiff
from itertools import zip_longest, chain
*/

const { sortBy } = require("lodash");
const diff = require("fast-diff");

function truncate(population, fitness, survival_percentile) {
  competition = sortBy(population, [fitness]);
  threshold = parseInt(population.length * survival_percentile);
  return competition.slice(0, threshold);
}

/**
 * Compte le nombre de lettres différentes entre deux textes de mêmes tailles.
 */
function letter_distance(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const lA = a[i];
    const lB = b[i];
    if (lA !== lB) sum++;
  }
  return sum;
}

/**
 * Compte le nombre de lettres différentes entre deux textes qui peuvent être de tailles différentes.
 */
function letter_distance_diff(a, b) {
  const differences = diff(a, b);
  let sum = 0;
  for (const [type, part] of differences) {
    if (type === diff.INSERT || type === diff.DELETE) {
      sum += part.length;
    }
  }
  return sum;
}

/**
 * Compte le nombre de bits différents entre deux entiers.
 */
function bit_distance(a, b, sizeOfInt) {
  let sum = 0;
  for (let i = 0; i < sizeOfInt; i++) {
    const nthBitA = (a >> i) & 1;
    const nthBitB = (b >> i) & 1;
    if (nthBitA !== nthBitB) {
      sum++;
    }
  }
  return sum;
}

/** Compte le nombre d'octets différents entre deux vecteurs qui peuvent être de tailles différentes. */
function bytearray_distance(g1, g2) {
  // return sum(1 for b1, b2 in zip_longest(g1, g2) if b1 != b2)
}

/**Compte le nombre de bits différents entre deux vecteurs qui peuvent être de tailles différentes.*/

function bytearray_bit_distance(g1, g2) {
  // return sum(bit_distance(b1, b2) if b1 is not None and b2 is not None else 8 for b1, b2 in zip_longest(g1, g2))
}

module.exports = { letter_distance, letter_distance_diff, bit_distance };
