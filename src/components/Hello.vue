<template>
  <div class="hello">
    <h1>{{ msg }}</h1>

    <ul class="artists">
      <li v-for="item in artists">
        {{ item.playcount }} : {{ item.name }}
      </li>
    </ul>
  </div>
</template>
<script>
// http://ws.audioscrobbler.com/2.0/?method=user.getweeklytrackchart&user=reknawn&api_key=57ee3318536b23ee81d6b27e36997cde&format=json
// http://ws.audioscrobbler.com/2.0/?method=user.getweeklytrackchart&user=Reknawn&apiKey=cd0ccd3a54f6da3e6c259d90f5ae702a&format=json
// import VueResource from 'vue-resource'
//
//

let config = {
  baseUrl: 'http://ws.audioscrobbler.com/2.0/?',
  userName: 'Reknawn',
  apiKey: 'cd0ccd3a54f6da3e6c259d90f5ae702a',
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

    buildGraph: function () {
      // var self = this
    },

    getWeekly: function (method, username, apiKey, from, to) {
      let formattedFrom = Date.parse(from) / 1000
      let formattedTo = Date.parse(to) / 1000
      let url = this.config.baseUrl + method +
                '&user=' + username +
                '&api_key=' + apiKey +
                '&from=' + formattedFrom +
                '&to=' + formattedTo +
                '&format=json'

      return this.$http.get(url, {})
    },

    getWeeklyArtistChart: function (from, to) {
      let self = this
      let artists = []
      let config = this.config

      this.msg = 'Loading Artists'

      let response = self.getWeekly(config.methods.getWeeklyArtistChart, config.userName, config.apiKey, from, to)

      /*
      ** Retrieve promise from getWeekly, then treat the response
      **
       */
      response.then((response) => {
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
          x++
        }
      }, (response) => {
          // do smth if error
      })
    }
  },
  ready: function () {
    // this.getWeeklyArtistChart('01/05/2015 00:00:00', '08/05/2015 00:00:00')
    this.getWeeklyArtistChart('05/01/2015 00:00:00', '05/08/2015 00:00:00')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  color: #42b983;
}

.artists {
  position: fixed;
  right: 5%;
  top: 0;
}
</style>
