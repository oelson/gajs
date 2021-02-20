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
      <label>
        Evaluation
        <select v-model="conf.selection.evaluation">
          <option value="text_distance">Text</option>
          <option value="bytes_distance">Byte</option>
        </select>
      </label>
      <label>
        Reproduction
        <select v-model="conf.reproduction.function">
          <option value="clone">Clone</option>
          <option value="couple">Couple</option>
        </select>
      </label>
      <label>
        Init size
        <input
          type="number"
          min="1"
          v-model.number="conf.start.length"
          size="4"
        />
      </label>
      <label>
        Init type
        <select v-model="conf.start.function">
          <option value="random_letter">Random letter</option>
          <option value="random_text">Random text</option>
        </select>
      </label>
      <label>
        Stop rank
        <input type="number" min="1" v-model.number="conf.stop.rank" size="4" />
      </label>
      <label>
        Stop survival
        <input
          type="number"
          min="0"
          max="1"
          v-model.number="conf.stop.survival_p"
          size="4"
          step="0.01"
        />
      </label>
    </div>

    <div class="conf-group">
      <label>
        Mutations per cycle
        <input
          type="number"
          min="0"
          v-model.number="conf.mutations.number_per_cycle"
          size="2"
        />
      </label>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Insert</th>
            <th>Remove</th>
            <th>Change</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Letter</th>
            <td>
              <input
                type="number"
                min="0"
                v-model.number="conf.mutations.functions.insert_letter"
                size="2"
              />
            </td>
            <td>
              <input
                type="number"
                min="0"
                v-model.number="conf.mutations.functions.remove_letter"
                size="2"
              />
            </td>
            <td>
              <input
                type="number"
                min="0"
                v-model.number="conf.mutations.functions.replace_letter"
                size="2"
              />
            </td>
          </tr>
          <tr>
            <th>Byte</th>
            <td>
              <input
                type="number"
                min="0"
                v-model.number="conf.mutations.functions.insert_byte"
                size="2"
              />
            </td>
            <td>
              <input
                type="number"
                min="0"
                v-model.number="conf.mutations.functions.remove_byte"
                size="2"
              />
            </td>
            <td>
              <input
                type="number"
                min="0"
                v-model.number="conf.mutations.functions.replace_byte"
                size="2"
              />
            </td>
          </tr>
        </tbody>
      </table>
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
          <th class="phenotype">Meilleur être</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ latest.rank }}</td>
          <td>{{ latest.population_length }}</td>
          <td class="probability">
            <template v-if="latest.best !== ''">
              {{ formatSurvivalP(latest.best.survival_p) }}-{{
                formatSurvivalP(latest.worst.survival_p)
              }}
            </template>
          </td>
          <td class="phenotype">{{ latest.best.phenotype }}</td>
        </tr>
      </tbody>
    </table>

    <canvas ref="chart" />
  </div>
</template>

<script>
import Chart from "chart.js"

export default {
  name: "EvolveText",
  data() {
    return {
      conf: {
        target: {
          alphabet: "abcdefghijklmnopqrstuvwxyz ",
          text: "les zebres sont cool",
        },
        start: {
          length: 30,
          function: "random_text",
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
            replace_letter: 0,
            insert_byte: 1,
            remove_byte: 1,
            replace_byte: 3,
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
      chartBuffer: [],
      chart: undefined,
      chartConfig: {
        type: "line",
        data: {
          datasets: [
            {
              label: "Survival",
              data: [],
              borderColor: "#3e95cd",
              fill: false,
              borderWidth: 2,
            },
          ],
        },
        options: {
          animation: {
            duration: 0,
          },
          hover: {
            animationDuration: 0,
            intersect: false,
          },
          responsiveAnimationDuration: 0,
          elements: {
            point: {
              radius: 0,
            },
            line: {
              tension: 0, // disables bezier curves
            },
          },
          tooltips: {
            mode: "nearest",
            axis: "x",
            callbacks: {
              beforeTitle: () => "Rank: ",
              label: (tooltipItem) => this.formatSurvivalP(tooltipItem.yLabel),
            },
          },
          scales: {
            xAxes: [
              {
                type: "linear",
              },
            ],
            yAxes: [
              {
                ticks: {
                  min: 0,
                  max: 1,
                },
              },
            ],
          },
        },
      },
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
      this.chartConfig.data.datasets[0].data = []
      this.chartBuffer = []
      this.latest = {
        rank: 0,
        population_length: 0,
        best: "",
        worst: "",
      }
      this.worker = new Worker("/worker/mutate_text.wk.umd.min.js")
      this.worker.onmessage = this.receive
      this.worker.postMessage(this.conf)
      this.refreshInterval = setInterval(this.renderChart, 1000)
    },

    renderChart() {
      let f
      while ((f = this.chartBuffer.shift()) !== undefined) {
        this.chartConfig.data.datasets[0].data.push(f)
      }
      this.chart.update()
    },

    receive(e) {
      const latest = e.data
      if (latest === null) {
        this.stop()
      } else {
        this.latest = latest
        this.chartBuffer.push({ x: latest.rank, y: latest.best.survival_p })
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
        this.renderChart()
      }
    },

    formatSurvivalP(p) {
      if (p === null || p === undefined) {
        return ""
      } else {
        return Math.round(p * 100).toFixed(0) + "%"
      }
    },
  },

  mounted() {
    this.chart = new Chart(this.$refs.chart, this.chartConfig)
  },

  beforeDestroy() {
    if (this.chart !== undefined) {
      this.chart.destroy()
      this.chart = undefined
    }
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
      line-height: 1em;
    }
  }

  canvas {
    max-width: 600px;
    max-height: 400px;
  }
}
</style>
