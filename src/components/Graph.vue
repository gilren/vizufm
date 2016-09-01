<template>
  <div class="graph-container" v-if="highestArtistPlaycount">
    <svg class="graph" preserveAspectRatio="none" viewBox="0 0 1920 900">
      <g class="grid x-grid">
        <line x1="0%" x2="0%" y1="0%" y2="100%"></line>
      </g>
      <g class="grid y-grid">
        <line x1="0%" x2="100%" y1="100%" y2="100%"></line>
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

      <g class="grid v-grid">
        <v-line
        v-for="stat in labels.vLines"
        :stat="stat"
        :index='$index'
        :total="labels.vLines.length">
      </v-line>
      </g>

      <!--<g class="data path one" data-setname="path one" opacity="0.4">
       <path class="path one" class="path" fill="#2FBFC9" d="M50,850 L50,192 L210,500 L405,179 L551,200 L1050,204 L1050,850 Z"/>
     </g>-->

      <g class="data path two" data-setname="path two" opacity="0.4">
         <artist-graph></artist-graph>
      </g>

      <!--<g class="data path two" data-setname="¨path two" opacity="0.4">
        <path class="path one" class="path" fill="#2BBAB1" d="M50,850 L50,192 L210,400 L405,179 L551,200 L1050,204 L1050,850 Z"/>
      </g>-->

      <g class="data path two" data-setname="¨path two" opacity="0.4">
        <path class="path one" class="path" fill="#2BBAB1" d="
          M0,900 L0,900
          L80,300 L240,400
          L400,179 L551,100
          L720,204 L880,800
          L1040,204 L1200,500
          L1520,600 L1680,800
          L1980,204 L1980,900 Z"/>
      </g>
    </svg>
  </div>
</template>

<script>
let axisXLabels = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

export default {
  props: ['highestArtistPlaycount', 'artists'],
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
    },
    'artist-graph': {
      props: {
        stat: Object,
        index: Number,
        total: Number
      },
      template: '<path width="100%" height="100%" class="path two" class="path" fill="#2FBFC9" d="M0,900 L0,300 L250,500 L405,179 L551,200 L1050,204 L1050,900 Z"/>',
      replace: true
    }
  },
  data () {
    return {
      axisXLabels: axisXLabels,
      axisYMaxNumber: this.highestArtistPlaycount,
      allArtists: this.artists,
      labels: {}
    }
  },
  methods: {
    createLabels: function (months, highestPlaycount) {
      let labels = {
        labelsX: [],
        labelsY: [],
        vLines: []
      }

      months.forEach(function (month, index) {
        var myLabelObj = {
          label: month,
          x: (8.333333333333333 * (index + 1) - (8.333333333333333 / 2)).toString() + '%',
          y: '98%'
        }

        var myLine = {
          x: (8.333333333333333 * (index + 1)).toString() + '%',
          y: '98%'
        }

        labels.labelsX.push(myLabelObj)
        labels.vLines.push(myLine)
      })

      for (var i = 0; i < 5; i++) {
        var myLabelObj = {
          // Get the highestPlaycount and create labels off it
          // We need to reverse the whole logic as the highest starts at the top
          label: (highestPlaycount - (highestPlaycount * (i / 4))).toString(),
          x: '2%',
          y: (100 * (i / 4)).toString() + '%'
        }
        labels.labelsY.push(myLabelObj)
      }

      return labels
    },
    createGraphs: function (allArtists) {
      console.log(allArtists)
      allArtists.forEach(function (artist) {
      })

      let graphs = {}
      return graphs
      // d="M0,900 L0,300 L250,500 L405,179 L551,200 L1050,204 L1050,900 Z"
      //          M0,900 L0,900
      //          L80,300 L240,400
      //          L400,179 L551,100
      //          L720,204 L880,800
      //          L1040,204 L1200,500
      //          L1520,600 L1680,800
      //          L1980,204 L1980,900 Z"/>

      // let start = "M0,900"
      // let end = "L1050,900 Z"
    }

  },
  ready: function () {
    let self = this
    // [Find an alternative to timeout]
    setTimeout(function () {
      self.labels = self.createLabels(self.axisXLabels, self.highestArtistPlaycount)
      self.graphs = self.createGraphs(self.allArtists)
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
  font-weight: bold;
}

.graph .labels.y-labels {
  text-anchor: end;
}

.labels {
  font-size: 13px;

}

.labels text {
  fill:#FFF;
}

.v-grid line {
  stroke: rgba(255, 255, 255, 0.1);
  stroke-width:1;
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
