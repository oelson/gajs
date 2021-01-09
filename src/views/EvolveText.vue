<template>
  <div class="evolve">
    <input
      ref="tg"
      type="text"
      placeholder="Texte cible"
      class="text"
      v-model="targetText"
      :readonly="running"
    />
    <button ref="go" @click="toggle">
      <template v-if="running">Stop</template>
      <template v-else>Go</template>
    </button>
    <span>{{ betterText }}</span>
  </div>
</template>

<script>
export default {
  name: "EvolveText",
  data() {
    return {
      running: false,
      targetText: "le cadavre exquis boira le vin nouveau",
      betterText: "",
    }
  },

  methods: {
    toggle() {
      this.running = !this.running
    },
  },
}
</script>

<style lang="less" scoped>
.evolve {
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-around;
  align-items: center;

  .text {
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    box-sizing: border-box;
  }
}
</style>
