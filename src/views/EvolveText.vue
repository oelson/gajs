<template>
  <div class="evolve">
    <div class="conf-group">
      <label>
        Alphabet
        <select v-model="conf.target.alphabet">
          <option value="abcdefghijklmnopqrstuvwxyz ">[a-z ]</option>
          <option value="abcdefghijklmnopqrstuvwxyz0123456789 ">
            [a-z0-9 ]
          </option>
          <option
            value="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 "
          >
            [a-zA-Z0-9 ]
          </option>
        </select>
      </label>

      <label>
        Texte
        <input
          type="text"
          v-model="conf.target.text"
          :readonly="worker !== undefined"
        />
      </label>

      <label></label>
    </div>

    <button ref="go" @click="toggle">
      <template v-if="worker !== undefined">Stop</template>
      <template v-else>Go</template>
    </button>

    <table class="summary">
      <thead>
        <tr>
          <th>Rang</th>
          <th>Population</th>
          <th>Survie</th>
          <th class="phenotype">Meilleur</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ latest.rank }}</td>
          <td>{{ latest.population_length }}</td>
          <td>
            {{ formatSurvivalP(latest.best.survival_p) }} -
            {{ formatSurvivalP(latest.worst.survival_p) }}
          </td>
          <td>{{ latest.best.phenotype }}</td>
        </tr>
      </tbody>
    </table>
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
          evaluation: "text_distance",
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
        this.stop()
      } else {
        this.worker = new Worker("/worker/mutate_text.wk.umd.min.js")
        this.worker.onmessage = (e) => this.receive(e.data)
        this.worker.postMessage(this.conf)
      }
    },

    receive({ rank, best, worst, population_length, end }) {
      if (end) {
        this.stop()
      } else {
        this.latest = { rank, best, worst, population_length }
      }
    },

    stop() {
      if (this.worker !== undefined) {
        this.worker.terminate()
        this.worker = undefined
      }
    },

    formatSurvivalP(p) {
      if (p === null || p === undefined) {
        return ""
      } else {
        return p.toFixed(2)
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

  .conf-group {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;
    align-items: center;

    label {
      margin: 0.5em;
    }
  }

  .summary {
    font-family: monospace;

    .phenotype {
      text-align: left;
    }
  }
}
</style>
