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
      let config = this.config

      this.msg = 'Loading Artists'

      return self.getWeekly(config.methods.getWeeklyArtistChart, config.userName, config.apiKey, from, to)
    },
    /*
    ** int, int
    **
     */
    getMonthlyArtistChart: function (month, year) {
      let totalArtists = []
      let self = this
      let weeks = this.getWeeksInMonth(month, year)
      let promises = []
      let artistsNames = []

      weeks.forEach(function (week) {
        let from = '' + (month + 1) + '-' + week.start + '-' + year + ' 00:00:00'
        let to = '' + (month + 1) + '-' + week.end + '-' + year + ' 00:00:00'

        console.log(from + ' ' + to)
        promises.push(self.getWeeklyArtistChart(from, to))
      })

      Promise.all(promises).then(function (dataArr) {
        dataArr.forEach(function (response, index) {
          let data = JSON.parse(response.body).weeklyartistchart
          let dataLength = data.artist.length
          const LIMIT = 10
          let x = 0
          while (x < dataLength && x < LIMIT) {
            let artist = data.artist[x]
            let myArtist = {
              name: artist.name,
              playcount: parseInt(artist.playcount),
              url: artist.url
            }

            // if not first week
            if (index !== 0) {
              // check for duplicated artist
              if (artistsNames.indexOf(myArtist.name) > -1) {
                let foundArtist = totalArtists.findIndex(
                  function (obj) {
                    return obj.name === myArtist.name
                  })
                console.log(foundArtist)
                console.log(myArtist.name)
                console.log(totalArtists[foundArtist].playcount = totalArtists[foundArtist].playcount + myArtist.playcount)
              }
            } else {
              artistsNames.push(myArtist.name)
              totalArtists.push(myArtist)
            }

            console.log(x + ': ' + myArtist.playcount + ' | ' + myArtist.name)
            self.artists.push(myArtist)
            x++
          }
        })
      }).catch(function (e) {
        console.log(e)
      })
      console.log(totalArtists)
    },
    getWeeksInMonth: function (month, year) {
      let weeks = []
      let firstDate = new Date(year, month, 1)
      let lastDate = new Date(year, month + 1, 0)
      let numDays = lastDate.getDate()

      let start = 1
      let end = 8 - firstDate.getDay()
      while (start <= numDays) {
        weeks.push({
          start: start,
          end: end
        })
        start = end + 1
        end = end + 7
        if (end > numDays) {
          end = numDays
        }
      }
      return weeks
    }
  },
  ready: function () {
    // this.getWeeklyArtistChart('01/05/2015 00:00:00', '08/05/2015 00:00:00')
    // console.log('05/01/2015 00:00:00', '05/08/2015 00:00:00')
    // this.getWeeklyArtistChart('05/01/2015 00:00:00', '05/08/2015 00:00:00')

    this.getMonthlyArtistChart(6, 2016)
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
