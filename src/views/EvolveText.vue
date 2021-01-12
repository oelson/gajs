<template>
  <div class="evolve">
    <input
      ref="tg"
      type="text"
      placeholder="Texte cible"
      class="text"
      v-model="conf.target.text"
      :readonly="worker !== undefined"
    />
    <button ref="go" @click="toggle">
      <template v-if="worker !== undefined">Stop</template>
      <template v-else>Go</template>
    </button>

    <span>
      [{{ latest.rank }}] s:{{ latest.population_length }} p:{{
        latest.best_survival
      }}
      -
      {{ latest.worst_survival }}
      b:"{{ latest.best.phenotype }}" (0x{{ latest.best.genotype_byte_string }})
    </span>
  </div>
</template>

<script>
export default {
  name: "EvolveText",
  data() {
    return {
      conf: {
        target: {
          alphabet: "abcdefghijklmnopqrstuvwxyz ",
          text: "les zebres sont des animaux tres fragiles",
        },
        start: {
          length: 100,
          function: "random_fixed_length",
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
      },
      worker: undefined,
      latest: {
        rank: 0,
        population_length: 0,
        best: "",
        worst: "",
      },
    }
  },

  methods: {
    toggle() {
      if (this.worker !== undefined) {
        this.worker.terminate()
        this.worker = undefined
      } else {
        this.worker = new Worker("/worker/mutate_text.wk.umd.min.js")
        this.worker.onmessage = (e) => {
          this.latest = e.data
        }
        this.worker.postMessage(this.conf)
      }
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
