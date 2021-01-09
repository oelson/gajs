const { diffChars, diffArrays } = require("diff")

function str_distance(a, b) {
  const differences = diffChars(a, b)
  let sum = 0
  for (const { count, added, removed } of differences) {
    if (added === true || removed === true) {
      sum += count
    }
  }
  return sum
}

function vector_distance(a, b) {
  const differences = diffArrays(a, b)
  let sum = 0
  for (const { count, added, removed } of differences) {
    if (added === true || removed === true) {
      sum += count
    }
  }
  return sum
}

function integer_binary_distance(a, b) {
  const aStr = a.toString(2),
    bStr = b.toString(2)
  return str_distance(aStr, bStr)
}

function byte_vector_distance(a, b) {
  const aStr = integer_vector_to_binary(a, 8)
  const bStr = integer_vector_to_binary(b, 8)
  return str_distance(aStr, bStr)
}

function integer_vector_to_binary(vector, binaryLength) {
  const binary_vector = vector.map(function(int) {
    const binary = int.toString(2)
    const padded = binary.padStart(binaryLength, "0")
    const truncated = padded.substring(0, binaryLength)
    return truncated
  })
  return binary_vector.join("")
}

module.exports = {
  str_distance,
  vector_distance,
  integer_binary_distance,
  byte_vector_distance
}
