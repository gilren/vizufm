<template>
  <div class="hello">
    <h1>{{ msg }}</h1>

    <ul>
      <li v-for="item in artists">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>
<script>
// http://ws.audioscrobbler.com/2.0/?method=user.getweeklytrackchart&user=reknawn&api_key=57ee3318536b23ee81d6b27e36997cde&format=json
// http://ws.audioscrobbler.com/2.0/?method=user.getweeklytrackchart&user=Reknawn&apiKey=cd0ccd3a54f6da3e6c259d90f5ae702a&format=json
// import VueResource from 'vue-resource'
//
var Vue = require('vue')
var VueResource = require('vue-resource')

Vue.use(VueResource)

let config = {
  baseUrl: 'http://ws.audioscrobbler.com/2.0/?',
  userName: 'Reknawn',
  apiKey: 'cd0ccd3a54f6da3e6c259d90f5ae702a',
  from: Date.parse('01/05/2015 00:00:00') / 1000,
  to: Date.parse('02/05/2015 00:00:01') / 1000,
  methods: {
    getWeeklyArtistChart: 'method=user.getweeklyartistchart',
    getWeeklyAlbumChart: 'method=user.getweeklyalbumchart'
  }
}
export default {
  data () {
    return {
      msg: 'ryty',
      config: config,
      artists: []

      // 57ee3318536b23ee81d6b27e36997cde

      // Your API Key is cd0ccd3a54f6da3e6c259d90f5ae702a
      // Your secret is 66bf5a008964c70f1f438dee3e4b36f0
    }
  },
  methods: {

    getWeekly: function (method, username, apiKey, from, to) {
      let theResponse = false
      let url = this.config.baseUrl + method +
                '&user=' + username +
                '&api_key=' + apiKey +
                '&from=' + from +
                '&to=' + to +
                '&format=json'

      console.log(url)
      this.$http.get(url, {}).then((response) => {
        theResponse = response
      }, (response) => {
        theResponse = response
      })
      return theResponse
    },

    getWeeklyArtistChart: function () {
      let self = this
      let artists = []
      let config = this.config

      this.msg = 'Loading Artists'

      let response = self.getWeekly(config.methods.getWeeklyArtistChart, config.userName, config.apiKey, config.from, config.to)
      console.log(response)

      setTimeout(function () {
        let data = JSON.parse(response.body).weeklyartistchart
        let dataLength = data.artist.length
        const LIMIT = 10
        let x = 0
        while (x <= dataLength && x < LIMIT) {
          let artist = data.artist[x]
          let myArtist = {
            name: artist.name,
            playcount: artist.playcount,
            url: artist.url
          }
          artists.push(myArtist)
          self.artists.push(myArtist)
          console.log(myArtist)
          x++
        }
      }, 500)
    }
  },
  ready: function () {
    this.getWeeklyArtistChart()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  color: #42b983;
}
</style>
