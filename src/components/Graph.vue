<template>
  <div class="graph-container" v-if="highestArtistPlaycount">
    <svg class="graph" preserveAspectRatio="none" viewBox="0 0 1920 1000">

      <!--<g class="data path one" data-setname="path one" opacity="0.4">
       <path class="path one" class="path" fill="#2FBFC9" d="M50,850 L50,192 L210,500 L405,179 L551,200 L1050,204 L1050,850 Z"/>
     </g>-->

      <!--<g class="data path two" data-setname="path two" opacity="0.4">
         <artist-graph></artist-graph>
      </g>-->

      <!--<g class="data path two" data-setname="¨path two" opacity="0.4">
        <path class="path one" class="path" fill="#2BBAB1" d="M50,850 L50,192 L210,400 L405,179 L551,200 L1050,204 L1050,850 Z"/>
      </g>-->

      <g class="data path three" data-setname="¨path three" opacity="0.3">
        <path class="path three" class="path" fill="#2BBAB1" d="
          M0,1000 L0,1000
          L60,1000 L320,1000

          L479,100 L640,288.2653061224492
          L800,706.1224489795919 L960,900
          L1120,983.9285714285714 L1280,996.5561224489796
          L1520,1000 L1680,1000
          L1920,1000 L1920,1000 Z"/>
      </g>

      <g class="data path three" data-setname="¨path three" opacity="0.3">
        <path class="path three" class="path" fill="#2FBFC9" d="
          M0,1000 L0,1000
          L160,601.6581632653063 L320,704.9744897959185
          L479,576.4030612244899 L640,715.3061224489797
          L800,848.4693877551021 L960,965.5612244897959

          L1120,949.4897959183674 L1280,1000
          L1520,998.8520408163265 L1680,1000

          L1920,1000 L1920,1000 Z"/>
      </g>

      <!--<g class="data path two" data-setname="¨path two" opacity="0.4">
        <path class="path one" class="path" fill="#2BBAB1" d="
          M0,1000 L0,1000
          L80,300 L240,400
          L400,179 L551,100
          L720,204 L880,800
          L1040,204 L1200,500
          L1520,600 L1680,800
          L1920,204 L1920,1000 Z"/>
      </g> -->

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
          y: ((90 * (i / 4)) + 10).toString() + '%'
        }
        labels.labelsY.push(myLabelObj)
      }

      return labels
    },
    createGraphs: function (allArtists, highestPlaycount) {
      let valueForOne = 900 / highestPlaycount
      let graphs = {}
      let xAxes = ['L80', 'L240', 'L400', 'L551', 'L720', 'L880', 'L1040', 'L1480', 'L1620', 'L1720', 'L1920']

      allArtists.forEach(function (artist) {
        let out = 'M0, 1000 L0,1000 '
        artist.playcounts.forEach(function (month, index) {
          let data = month.data
          out += xAxes[index] + ', ' + (1000 - (data * valueForOne)) + ' '
        })
        out += 'L1920, 1000 Z'// december
        console.log(out)
      })
      // 784 -> 900
      // 392 -> 450
      // 196 -> 225
      // 1 -> 1,147959183673469
      //
      //           M0,1000 L0,1000
      //          L80,300 L240,400
      //          L400,179 L551,100
      //          L720,204 L880,800
      //          L1040,204 L1200,500
      //          L1520,600 L1680,800
      //          L1920,204 L1920,1000 Z"/>

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
      self.graphs = self.createGraphs(self.allArtists, self.highestArtistPlaycount)
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
