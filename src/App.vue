<template>
  <div id="app">
    <h1>{{ msg }}</h1>
    <lastfm></lastfm>
    <header v-show="notempty">
      <graph :highest-artist-playcount="highestArtistPlaycount" :artists="artists"></graph>
    </header>
  </div>
</template>
<script>
import Graph from './components/Graph'
import Lastfm from './components/Lastfm'

export default {
  components: {
    Lastfm,
    Graph
  },
  data () {
    return {
      msg: 'ryty',
      artists: [],
      highestArtistPlaycount: 0
    }
  },
  methods: {
  },
  events: {
    'artists': function (myArtists) {
      this.artists = myArtists
    },
    'highestArtistPlaycount': function (highestArtistPlaycount) {
      this.highestArtistPlaycount = highestArtistPlaycount
    }
  },
  ready: function () {
    // this.getYearlyArtistChart(2015)
    // this.getMonthlyArtistChart(0, 2016)
  }
}
</script>
<style>
html {
  height: 100%;
  margin: 0;
  padding: 0;
}

body {
  margin: 0;
  padding: 0;
  height: 100%;
  background: #f0f0f0;
}

#app {
  color: #2c3e50;
  font-family: Source Sans Pro, Helvetica, sans-serif;
  margin: 0 auto;
}

#app a {
  color: #42b983;
  text-decoration: none;
}

header {
  background: #31333f;
  height: 900px;
    clear: both;
}
</style>
