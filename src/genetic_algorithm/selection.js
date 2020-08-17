/*
from difflib import ndiff
from itertools import zip_longest, chain
*/

import { sortBy } from "lodash";

function truncate(population, fitness, survival_percentile) {
  competition = sortBy(population, [fitness]);
  threshold = parseInt(population.length * survival_percentile);
  return competition.slice(0, threshold);
}

/**Compte le nombre de lettres différentes entre deux textes de mêmes tailles.*/
function letter_distance(a, b) {
  //return sum(1 for la, lb in zip(a, b) if la != lb)
}

/**Compte le nombre de lettres différentes entre deux textes qui peuvent être de tailles différentes.*/
function letter_distance_diff(a, b) {
  //return sum(1 for charinfo in ndiff(a, b) if not charinfo.startswith(' '))
}

/**Compte le nombre de bits différents entre deux entiers qui peuvent être de tailles différentes. Approximatif.*/
function bit_distance(a, b) {
  /*
    x = a ^ b
    number_of_ones = sum((x >> shift) & 1 for shift in range(0, x.bit_length() + 1))
    length_difference = abs(a.bit_length() - b.bit_length())
    return number_of_ones + length_difference
    */
}

/** Compte le nombre d'octets différents entre deux vecteurs qui peuvent être de tailles différentes. */
function bytearray_distance(g1, g2) {
  // return sum(1 for b1, b2 in zip_longest(g1, g2) if b1 != b2)
}

/**Compte le nombre de bits différents entre deux vecteurs qui peuvent être de tailles différentes.*/

function bytearray_bit_distance(g1, g2) {
  // return sum(bit_distance(b1, b2) if b1 is not None and b2 is not None else 8 for b1, b2 in zip_longest(g1, g2))
}
