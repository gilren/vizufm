<template>
  <div class="graph-container" v-if="highestArtistPlaycount">
    <svg class="graph">
      <g class="grid x-grid">
        <line x1="0%" x2="0%" y1="0%" y2="100%"></line>
      </g>
      <g class="grid y-grid">
        <line x1="0%" x2="100%" y1="100%" y2="100%"></line>
      </g>

      <g class="grid v-grid">
        <v-line
        v-for="stat in labels.labelsX"
        :stat="stat"
        :index='$index'
        :total="labels.labelsX.length">
      </v-line>
      </g>

      <g class="labels x-labels">
        <axis-label
        v-for="stat in labels.labelsX"
        :stat="stat"
        :index='$index'
        :total="labels.labelsX.length">
        </axis-label>
      </g>

      <g class="labels y-labels">
        <axis-label
        v-for="stat in labels.labelsY"
        :stat="stat"
        :index='$index'
        :total="labels.labelsY.length">
        </axis-label>
      </g>

      <!--<g class="data path one" data-setname="¨path one" opacity="0.4">
        <path class="path one" class="path" fill="#2FBFC9" d="M50,850 L50,192 L210,500 L405,179 L551,200 L1050,204 L1050,850 Z"/>
      </g>
      <g class="data path two" data-setname="¨path two" opacity="0.4">
        <path class="path one" class="path" fill="#2BBAB1" d="M50,850 L50,192 L210,400 L405,179 L551,200 L1050,204 L1050,850 Z"/>
      </g>-->
    </svg>
  </div>
</template>

<script>
let axisXLabels = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

export default {
  props: ['highestArtistPlaycount'],
  components: {
    'axis-label': {
      props: {
        stat: Object,
        index: Number,
        total: Number
      },
      template: '<text :x="stat.x" :y="stat.y">{{stat.label}}</text>',
      replace: true
    },
    'v-line': {
      props: {
        stat: Object,
        index: Number,
        total: Number
      },
      template: '<line :x1="stat.x" :x2="stat.x" y1="0%" y2="100%"></line>',
      replace: true
    }
  },
  data () {
    return {
      axisXLabels: axisXLabels,
      axisYMaxNumber: this.highestArtistPlaycount,
      labels: {}
    }
  },
  methods: {
    createLabels: function (months, highestPlaycount) {
      let labels = {
        labelsX: [],
        labelsY: []
      }

      months.forEach(function (month, index) {
        var myLabelObj = {
          label: month,
          x: (8.333333333333333 * (index + 1) - (8.333333333333333 / 2)).toString() + '%',
          y: '98%'
        }
        labels.labelsX.push(myLabelObj)
      })

      for (var i = 0; i < 5; i++) {
        var myLabelObj = {
          // gotta need the math
          label: (highestPlaycount * (i / 4)).toString(),
          x: '2%',
          y: (100 * (i / 4)).toString() + '%'
        }
        labels.labelsY.push(myLabelObj)
      }

      return labels
    }
  },
  ready: function () {
    let self = this
    setTimeout(function () {
      self.labels = self.createLabels(self.axisXLabels, self.highestArtistPlaycount)
    }, 500)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  color: #42b983;
}

.graph-container {
  height: 100%;
  width: 100%;
}

.graph {
  height: 100%;
  width: 100%;
}

.graph .grid {
  stroke: #ccc;
  stroke-dasharray: 0;
  stroke-width: 1;
}

.graph .labels.x-labels {
  text-anchor: middle;
}

.graph .labels.y-labels {
  text-anchor: end;
}

.labels {
  font-size: 13px;
}

.label-title {
  font-weight: bold;
  text-transform: uppercase;
  font-size: 12px;
  fill: black;
}

.data {
  fill: red;
  stroke-width: 1;
}

line {
    fill: transparent;
    stroke: #ccc;
}

.path.one {
  -webkit-transition-delay: 100ms;
          transition-delay: 100ms;
}
</style>
