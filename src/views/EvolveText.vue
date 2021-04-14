<template>
  <div class="evolve">
    <p>
      <b>Thèse</b> L'évolution du code est d'autant moins facile que la
      complexité du code augmente. Les mutations individuelles ne peuvent pas
      produire de séquences complexes de code, tandis la sélection ne peut
      qu'éliminer les codes en évolution mais non fonctionnels ou
      sous-fonctionnels. L'accumulation de mutations neutres, soudainement
      basculées dans le domaine fonctionnel par chance, ne tient pas la route
      car la complexité du code rend l'apparition de ces séquences impossible
      statistiquement. Dit autrement, l'activité de programmation requiert de
      l'intelligence dans la capacité à percevoir à l'avance le résultat
      escompté et à produire la séquence de code fonctionnelle d'un coup : on ne
      programme pas par erreurs et essais au sein d'une masse de code non
      fonctionnelle. Et même dans le scénario d'un code préexistant et
      fonctionnel, la complexité du langage et du code rendent impossible toute
      amélioration substentielle par des moyens progressifs. Le code fonctionnel
      est comme placé sur un îlot entouré par une mer de mutations délètres,
      c'est la nature fragile du code. La distance de Hamming entre deux codes
      fonctionnels de fonctionnalité similaire est toujours trop grande, dans le
      monde des programmes réels, pour envisager un chemin évolutif de l'un à
      l'autre. Car contrairement à l'activité de programmation, l'évolution
      requiert strictement que tout chainon dans la filiation soit fonctionnel
      et au moins aussi bon que son prédécesseur.
    </p>
    <p>
      <b>Explication de la courbe de base en logarithme</b>
      La probabilité de se rapprocher d'une cible absolue est forte au début car
      toutes les positions de la chaînent peuvent contribuer à l'amélioration.
      Mais quand tous les caractères sauf un sont alignés, la probabilité que ce
      seul caractère passe d'un mauvais au bon est 1/a où a est la taille de
      l'alphabet. La formule générale donnant la probabilité de production d'un
      individu amélioré d'un seul caractère est n/a avec n la taille de la
      chaîne. C'est dans le cas où l'on remplace des caractères et non des bits.
      Ce scénario d'un début facile et d'une fin pénible se rencontre aussi dans
      le monde de l'élevage : il est facile de croiser certaines espèces de
      crevettes très différentes pour produire des individus radicalement
      différents, mais plus on sélectionne un trait précis, plus on a besoin de
      générations proprement sélectionnées : on affine à la fin.
    </p>
    <p>
      <b>Oscillation</b> Constat 1 : à chaque génération tous les "mauvais" ne
      sont pas retirés car la pression sélective n'est pas si forte. On retire
      les 1/n les pires (où n est le taux de fécondité). Si les bons sont
      majoritaires, on retire donc des bons avec les mauvais. Si au contraire
      les mauvais sont majoritaires, alors des mauvais passent à la génération
      suivante.
      <u
        >Or tout le problème de code est la surrabondance des mauvais devant les
        bons</u
      >
    </p>
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
            insert_letter: 0,
            remove_letter: 0,
            replace_letter: 1,
            insert_byte: 0,
            remove_byte: 0,
            replace_byte: 0,
          },
          number_per_cycle: 1,
        },
        stop: {
          rank: 100,
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

  computed: {
    latest() {
      return this.generations[this.generations.length - 1]
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
    max-width: 1200px;
    max-height: 800px;
  }
}
</style>
