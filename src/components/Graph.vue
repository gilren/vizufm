<template>
  <svg class="graph">
    <g class="grid x-grid">
      <line x1="50" x2="50" y1="50" y2="850"></line>
    </g>
    <g class="grid y-grid">
      <line x1="50" x2="1050" y1="850" y2="850"></line>
    </g>

    <g class="labels x-labels">
      <axis-label
      v-for="stat in statsX"
      :stat="stat"
      :index='$index'
      :total="stats.length">
      </axis-label>
    </g>

    <g class="labels y-labels">
      <axis-label
      v-for="stat in statsY"
      :stat="stat"
      :index='$index'
      :total="stats.length">
      </axis-label>
    </g>

    <g class="data path one" data-setname="¨path one" opacity="0.4">
      <path class="path one" class="path" fill="#2FBFC9" d="M50,850 L50,192 L210,500 L405,179 L551,200 L1050,204 L1050,850 Z"/>
    </g>
    <g class="data path two" data-setname="¨path two" opacity="0.4">
      <path class="path one" class="path" fill="#2BBAB1" d="M50,850 L50,192 L210,400 L405,179 L551,200 L1050,204 L1050,850 Z"/>
    </g>
  </svg>
</template>

<script>
let statsX = [
  {label: 'J', x: '50', y: '870'},
  {label: 'F', x: '133,3333333333333', y: '870'},
  {label: 'M', x: '216,6666666666667', y: '870'},
  {label: 'A', x: '300', y: '870'},
  {label: 'M', x: '383,3333333333333', y: '870'},
  {label: 'J', x: '466,6666666666667', y: '870'},
  {label: 'J', x: '550', y: '870'},
  {label: 'A', x: '633,3333333333333', y: '870'},
  {label: 'S', x: '716,6666666666666', y: '870'},
  {label: 'O', x: '800', y: '870'},
  {label: 'N', x: '883,3333333333333', y: '870'},
  {label: 'D', x: '966,6666666666666', y: '870'},
  {label: 'MONTH', x: '525', y: '900', class: 'label-title'}
]

let statsY = [
  {label: '0', x: '45', y: '725'},
  {label: '40', x: '45', y: '500'},
  {label: '80', x: '45', y: '275'},
  {label: '120', x: '45', y: '50'},
  {label: 'COUNT', x: '30', y: '450', class: 'label-title'}
]

// {year: 1977, NASA: 4002, US: 409218, pct: 0.98, president: 'Jimmy Carter', party: 'D'},

export default {
  components: {
    'axis-label': {
      props: {
        stat: Object,
        index: Number,
        total: Number
      },
      template: '<text :x="stat.x" :y="stat.y">{{stat.label}}</text>',
      replace: true
    }
  },
  data () {
    return {
      statsX: statsX,
      statsY: statsY
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  color: #42b983;
}

.graph .labels.x-labels {
  text-anchor: middle;
}

.graph .labels.y-labels {
  text-anchor: end;
}

.graph {
  height: 900px;
  width: 1100px;
}

.graph .grid {
  stroke: #ccc;
  stroke-dasharray: 0;
  stroke-width: 1;
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
    stroke: #999;
}

.path.one {
  -webkit-transition-delay: 100ms;
          transition-delay: 100ms;
}
</style>
