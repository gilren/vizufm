<template>
  <div id="app">
    <h1>{{ msg }}</h1>
    <ul class="artists">
      <li v-for="item in artists">
        {{ item.playcount }} : {{ item.name }}
      </li>
    </ul>
    <header>
      <graph :highest-artist-playcount="highestArtistPlaycount"></graph>
    </header>
  </div>
</template>

<script>
import Graph from './components/Graph'

const config = {
  baseUrl: 'http://ws.audioscrobbler.com/2.0/?',
  userName: 'Reknawn',
  apiKey: 'cd0ccd3a54f6da3e6c259d90f5ae702a',
  limitOfArtistsToFetch: 10,
  methods: {
    getWeeklyArtistChart: 'method=user.getweeklyartistchart',
    getWeeklyAlbumChart: 'method=user.getweeklyalbumchart'
  }
}

export default {
  components: {
    Graph
  },
  data () {
    return {
      msg: 'ryty',
      config: config,
      artists: [],
      highestArtistPlaycount: 0
    }
  },
  methods: {

    buildGraph: function () {
      // var self = this
    },

    getWeekly: function (method, username, apiKey, from, to) {
      let url = this.config.baseUrl + method +
                '&user=' + username +
                '&api_key=' + apiKey +
                '&from=' + Date.parse(from) / 1000 +
                '&to=' + Date.parse(to) / 1000 +
                '&format=json'

      return this.$http.get(url, {})
    },

    getWeeklyArtistChart: function (from, to) {
      let self = this
      let config = this.config

      this.msg = 'Loading Artists'

      return self.getWeekly(config.methods.getWeeklyArtistChart, config.userName, config.apiKey, from, to)
    },

    getMonthlyArtistChart: function (month, year) {
      let self = this
      let weeks = this.getWeeksInMonth(month, year)
      let promises = []

      weeks.forEach(function (week) {
        let from = '' + (month + 1) + '-' + week.start + '-' + year + ' 00:00:00'
        let to = '' + (month + 1) + '-' + week.end + '-' + year + ' 00:00:00'
        promises.push(self.getWeeklyArtistChart(from, to))
      })

      return self.fetchMonthlyArtistChart(promises)
    },

    fetchMonthlyArtistChart: function (arrayPromises) {
      let self = this
      let totalArtists = []
      let artistsNames = []

      // Executes when all promises are done
      Promise.all(arrayPromises).then(function (dataArr) {
        dataArr.forEach(function (weeklyArtistResponse, index) {
          let data = JSON.parse(weeklyArtistResponse.body).weeklyartistchart
          let dataLength = data.artist.length
          let x = 0
          while (x < dataLength && x < self.config.limitOfArtistsToFetch) {
            let artist = data.artist[x]
            let myArtist = {
              name: artist.name,
              playcount: parseInt(artist.playcount),
              url: artist.url
            }

            // Search for duplicated artists from the first week's data
            if (index !== 0 && artistsNames.indexOf(myArtist.name) > -1) {
              let foundArtist = totalArtists.findIndex(
                function (obj) {
                  return obj.name === myArtist.name
                })

              // In case the artist already exist, we update its playcount
              totalArtists[foundArtist].playcount += myArtist.playcount
            } else {
              // Adding a new artist and refering its name in an array for the duplication test
              artistsNames.push(myArtist.name)
              totalArtists.push(myArtist)
            }
            x++
          }
        })

        // When all the data has been stored we sort it by the highest play count
        // Then we assign it to the artists array of the app's data
        totalArtists = totalArtists.sort(function (a, b) {
          return b.playcount - a.playcount
        })
        self.highestArtistPlaycount = totalArtists[0].playcount
        self.artists = totalArtists
      }).catch(console.log.bind(console))
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
    this.getMonthlyArtistChart(5, 2016)
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
  /* background: #31333f; */
  height: 900px;
}

h1 {
  color: #42b983;
}

.artists {
  position: fixed;
  right: 5%;
  top: 0;
}

</style>
