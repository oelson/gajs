const random = require("random")

function insert_random_byte(bytes) {
  const new_byte = random.int(0x00, 0xff)
  const byte_index = random.int(0, bytes.length - 1)
  bytes.splice(byte_index, 0, new_byte)
}

function remove_random_byte(bytes) {
  const byte_index = random.int(0, bytes.length - 1)
  bytes.splice(byte_index, 1)
}

function replace_random_byte(bytes) {
  const new_byte = random.int(0x00, 0xff)
  const byte_index = random.int(0, bytes.length - 1)
  bytes[byte_index] = new_byte
}

function random_bytes(length) {
  const bytes = []
  for (let i = 0; i < length; ++i) {
    const random_byte = random.int(0x00, 0xff)
    bytes.push(random_byte)
  }
  return bytes
}

module.exports = {
  replace_random_byte,
  insert_random_byte,
  remove_random_byte,
  random_bytes,
}
