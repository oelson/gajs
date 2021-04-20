<template>
  <div class="evolve">
    <div class="conf-group">
      <h1>Text</h1>
      <label>
        Alphabet
        <select v-model="conf.target.alphabet">
          <option value="">from text</option>
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
        Target
        <input
          type="text"
          v-model="conf.target.text"
          :readonly="worker !== undefined"
          size="100"
        />
      </label>
    </div>
    <div class="conf-group">
      <h1>Initialization</h1>
      <label>
        Size
        <input
          type="number"
          min="1"
          v-model.number="conf.start.length"
          size="4"
        />
      </label>

      <label>
        Type
        <select v-model="conf.start.function">
          <option value="random_letter">Random letter</option>
          <option value="random_text">Random text</option>
        </select>
      </label>
    </div>
    <div class="conf-group">
      <h1>Reproduction</h1>
      <label>
        Rate
        <input
          type="number"
          min="1"
          max="100"
          size="3"
          v-model="conf.reproduction.rate"
        />
      </label>
      <label>
        Mode
        <select v-model="conf.reproduction.function">
          <option value="clone">Clone</option>
          <option value="couple">Couple</option>
        </select>
      </label>
    </div>
    <div class="conf-group">
      <h1>Stop</h1>
      <label>
        Rank
        <input type="number" min="1" v-model.number="conf.stop.rank" size="4" />
      </label>
      <label>
        Survival probability
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
      <h1>Mutation</h1>

      <table class="mutation-distribution">
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

      <label>
        Rate
        <input
          type="number"
          min="0"
          v-model.number="conf.mutations.rate"
          size="2"
        />
      </label>
    </div>
    <div class="conf-group">
      <h1>Selection</h1>
      <label>
        Evaluation
        <select v-model="conf.selection.evaluation">
          <option value="text_distance">Text</option>
          <option value="bytes_distance">Byte</option>
        </select>
      </label>
    </div>
    <div class="info">
      <h1>Population stability</h1>

      “At each generation the population grows from {{ conf.start.length }} to
      {{ populationLengthAfterReproduction }} beings ({{
        conf.reproduction.rate
      }}
      times more), and the
      {{ numberOfInaptBeings.toFixed(0) }} less apt beings (or
      {{ formatPercentage(percentageOfInaptBeings) }} of the population) are
      deducted to fall back to {{ conf.start.length }}.”
    </div>
    <hr />
    <button ref="go" @click="toggle">
      <template v-if="worker !== undefined">Stop</template>
      <template v-else>Go</template>
    </button>

    <table class="summary" v-if="latest !== undefined">
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
              {{ formatPercentage(latest.best.survival_p) }}-{{
                formatPercentage(latest.worst.survival_p)
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
          alphabet: "",
          text:
            "Voix ambiguë d'un cœur qui, au zéphyr, préfère les jattes de kiwis.",
        },
        start: {
          length: 150,
          function: "random_letter",
        },
        reproduction: {
          rate: 30,
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
            replace_letter: 1,
            insert_byte: 0,
            remove_byte: 0,
            replace_byte: 0,
          },
          rate: 4,
        },
        stop: {
          rank: 1000,
          survival_p: 1.0,
        },
      },
      worker: undefined,
      refreshInterval: undefined,
      generations: [],
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
              label: (tooltipItem) => this.formatPercentage(tooltipItem.yLabel),
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

  computed: {
    latest() {
      return this.generations[this.generations.length - 1]
    },
    populationLengthAfterReproduction() {
      return this.conf.start.length * this.conf.reproduction.rate
    },
    numberOfInaptBeings() {
      return (
        (1 - 1 / this.conf.reproduction.rate) *
        this.conf.start.length *
        this.conf.reproduction.rate
      )
    },
    percentageOfInaptBeings() {
      return 1 - 1 / this.conf.reproduction.rate
    },
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
      this.generations = []
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
      const generation = e.data
      if (generation === null) {
        this.stop()
      } else {
        this.generations.push(generation)
        const point = { x: generation.rank, y: generation.best.survival_p }
        this.chartBuffer.push(point)
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

    formatPercentage(p) {
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
  h1 {
    font-size: 1.2em;
  }

  .mutation-distribution {
    th {
      font-weight: normal;
    }
  }

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
    max-width: 1200px;
    max-height: 800px;
  }
}
</style>
