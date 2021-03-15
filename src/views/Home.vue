<template>
  <div class="home">
    <input v-model="text" />
    <div class="letter">
      <table>
        <thead>
          <tr>
            <th>Char</th>
            <th>Code point</th>
            <th>Code point (bin)</th>
            <th>Bytes (bin)</th>
            <th>Bytes (hex)</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(
              { utf16Char, utf8Bytes }, i
            ) in utf16stringToLettersWithBytes(text)"
            :key="i"
          >
            <td class="ac">{{ visibleChar(utf16Char) }}</td>
            <td class="m ac">{{ codePointOf(utf16Char) }}</td>
            <td class="m ar p">{{ binaryCodePointOf(utf16Char) }}</td>
            <td class="m ar" v-html="utf8BinaryOf(utf8Bytes)" />
            <td class="m ar">{{ utf8BytesOf(utf8Bytes) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import { encode_utf8 } from "@/ga/text"

function i2s(n, b, l) {
  return n.toString(b).toUpperCase().padStart(l, "0")
}

export default {
  methods: {
    utf16stringToLettersWithBytes(utf16String) {
      return Array.from(utf16String).map((utf16Char) => ({
        utf16Char,
        utf8Bytes: encode_utf8(utf16Char),
      }))
    },
    visibleChar(utf16Char) {
      return utf16Char === " " ? "␠" : utf16Char
    },
    codePointOf(utf16Char) {
      const repr = utf16Char
        .codePointAt(0)
        .toString(16)
        .toUpperCase()
        .padStart(6, "0")
      return `U+${repr}`
    },
    binaryCodePointOf(utf16Char) {
      return utf16Char
        .codePointAt(0)
        .toString(2)
        .match(/.{1,6}(?=(.{6})*$)/g)
        .join(" ")
    },
    utf8BytesOf(utf8Bytes) {
      return utf8Bytes.map((b) => i2s(b, 16, 2)).join(" ")
    },
    utf8BinaryOf(utf8Bytes) {
      const replacement = `<span class="h">$1</span><span class="p">$2</span>`
      return utf8Bytes
        .map((b) => i2s(b, 2, 8))
        .join(" ")
        .replace(/(0)([01]{7})/g, replacement)
        .replace(/(10)([01]{6})/g, replacement)
        .replace(/(110)([01]{5})/g, replacement)
        .replace(/(1110)([01]{4})/g, replacement)
        .replace(/(11110)([01]{3})/g, replacement)
    },
  },
  data() {
    return {
      text: "Methinks it is like a weasel.",
    }
  },
}
</script>

<style lang="less" scoped>
table {
  margin: 1em auto;
  border-collapse: collapse;

  th,
  td {
    border: 1px solid darken(white, 5%);
    padding: 3px;
  }
}
.m {
  font-family: monospace;
}
.ac {
  text-align: center;
}
.al {
  text-align: left;
}
.ar {
  text-align: right;
}
</style>

<style lang="less">
.h {
  color: red;
}
.p {
  color: darken(blue, 10%);
}
</style>