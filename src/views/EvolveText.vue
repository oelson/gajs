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
          <th>Meilleure p.</th>
          <th>Pire p.</th>
          <th class="phenotype">Meilleur être</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ latest.rank }}</td>
          <td>{{ latest.population_length }}</td>
          <td class="probability">
            {{ formatSurvivalP(latest.best.survival_p) }}
          </td>
          <td class="probability">
            {{ formatSurvivalP(latest.worst.survival_p) }}
          </td>
          <td class="phenotype">{{ latest.best.phenotype }}</td>
        </tr>
      </tbody>
    </table>

    <apexcharts
      ref="chart"
      width="500"
      type="line"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts"

export default {
  name: "EvolveText",
  components: {
    apexcharts: VueApexCharts,
  },
  data() {
    return {
      conf: {
        target: {
          alphabet: "abcdefghijklmnopqrstuvwxyz ",
          text: "les zebres sont cool",
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
      refreshInterval: undefined,
      latest: {
        rank: 0,
        population_length: 0,
        best: "",
        worst: "",
      },
      chartOptions: {
        xaxis: {
          type: "numeric",
        },
        yaxis: {
          min: 0,
          max: 1,
          tickAmount: 10,
          labels: {
            formatter: this.formatSurvivalP,
          },
        },
        stroke: {
          curve: "smooth",
          width: 2,
        },
        chart: {
          animations: {
            enabled: false,
          },
        },
        grid: {
          borderColor: "#ccc",
          strokeDashArray: 2,
          yaxis: {
            lines: {
              show: true,
            },
          },
        },
      },
      series: [
        {
          name: "survival probability",
          data: [],
        },
      ],
    }
  },

  methods: {
    toggle() {
      if (this.worker !== undefined) {
        this.stop()
      } else {
        this.run()
      }
    },

    run() {
      this.series[0].data = []
      this.latest = {
        rank: 0,
        population_length: 0,
        best: "",
        worst: "",
      }
      this.worker = new Worker("/worker/mutate_text.wk.umd.min.js")
      this.worker.onmessage = this.receive
      this.worker.postMessage(this.conf)
      this.refreshInterval = setInterval(this.$refs.chart.refresh, 100)
    },

    receive(e) {
      const latest = e.data
      if (latest === null) {
        this.stop()
      } else {
        this.latest = latest
        this.series[0].data.push(latest.best.survival_p)
      }
    },

    stop() {
      if (this.worker !== undefined) {
        this.worker.terminate()
        this.worker = undefined
      }
      if (this.refreshInterval !== undefined) {
        clearInterval(this.refreshInterval)
        this.refreshInterval = undefined
        this.$refs.chart.refresh()
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
  .summary {
    font-family: monospace;

    th.phenotype {
      text-align: left;
    }

    td.phenotype {
      white-space: nowrap;
    }
  }
}
</style>
