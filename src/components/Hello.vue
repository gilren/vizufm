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
  to: Date.parse('02/05/2015 00:00:01') / 1000
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
    getWeeklyArtistChart: function () {
      let self = this
      let artists = []
      let method = 'method=user.getweeklyartistchart'
      let url = this.config.baseUrl + method +
                '&user=' + this.config.userName +
                '&api_key=' + this.config.apiKey +
                '&from=' + this.config.from +
                '&to=' + this.config.to +
                '&format=json'

      this.msg = 'Loading Artists'

      this.$http.get(url, {}).then((response) => {
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
          console.log(myArtist)
          self.artists.push(myArtist)
          x++
        }
      }, (response) => {
        console.log(response)
      })
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
