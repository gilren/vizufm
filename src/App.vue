<template>
  <div id="app">
    <h1>{{ msg }}</h1>
    <div>
    <ul class="artists">
      <li v-for="artist in artists" track-by="$index">
        {{ artist.totalPlaycounts }} : {{ artist.name }}
        <ul>
          <li v-for="month in artist.playcounts" track-by="$index">
            {{ month.date }} : {{ month.data }}
          </li>
        </ul>
      </li>
    </ul>
  </div>
  <div style="clear:both">
    <ul class="monthsByArtist">
      <li v-for="item in monthsByArtist" track-by="$index">
        {{ item.playcount }} : {{ item.name }}
        <ul>
          <li v-for="month in item.monthsByArtist" track-by="$index">
            {{ artist.playcount }} : {{ artist.name }}
          </li>
        </ul>
      </li>
    </ul>
    </div>
    <header>
      <graph :highest-artist-playcount="highestArtistPlaycount" :artists="artists"></graph>
    </header>
  </div>
</template>
<script>
import Graph from './components/Graph'

const config = {
  apiKey: 'cd0ccd3a54f6da3e6c259d90f5ae702a',
  baseUrl: 'http://ws.audioscrobbler.com/2.0/?',
  limitOfArtistsToFetch: 20,
  methods: {
    getWeeklyAlbumChart: 'method=user.getweeklyalbumchart',
    getWeeklyArtistChart: 'method=user.getweeklyartistchart'
  },
  userName: 'Reknawn'
}

export default {
  components: {
    Graph
  },
  data () {
    return {
      msg: 'ryty',
      config: config,
      allArtists: [],
      artists: [],
      highestArtistPlaycount: 0,
      monthsByArtist: []
    }
  },
  methods: {

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
      let config = self.config

      self.msg = 'Loading Artists'

      return self.getWeekly(config.methods.getWeeklyArtistChart, config.userName, config.apiKey, from, to)
    },

    getMonthlyArtistChart: function (month, year) {
      let self = this
      let date = (month + 1) + '/' + year
      let weeks = this.getWeeksInMonth(month, year)
      let promises = []

      weeks.forEach(function (week) {
        let from = '' + (month + 1) + '-' + week.start + '-' + year + ' 00:00:01'
        let to = '' + (month + 1) + '-' + week.end + '-' + year + ' 23:59:59'
        promises.push(self.getWeeklyArtistChart(from, to))
      })

      return self.fetchMonthlyArtistChart(promises, date, month)
    },
    addArtist: function (artist, date, currentWeek, month) {
      let self = this
      let playcounts = {
        date: date,
        data: artist.totalPlaycounts
      }
      let foundArtist = false

      // Action for not first month && not first week
      if (month !== 0 || currentWeek !== 0) {
        var i = 0
        while (i < self.allArtists.length && !foundArtist) {
          let currentArtist = self.allArtists[i]

          // Check if the artist to add is already in the array
          if (currentArtist.name === artist.name) {
            foundArtist = true
            let addedPlays = false

            currentArtist.totalPlaycounts += artist.totalPlaycounts

            // Check if there's already data for the current month
            var j = 0
            while (j < currentArtist.playcounts.length && !addedPlays) {
              if (currentArtist.playcounts[j].date === playcounts.date) {
                addedPlays = true
                currentArtist.playcounts[j].data += playcounts.data
              } else {
                if (j === currentArtist.playcounts.length - 1) {
                  currentArtist.playcounts.push(playcounts)
                  addedPlays = true
                }
              }
              j++
            }
          }
          i++
        }
        if (!foundArtist) {
          for (var k = 0; k < month; k++) {
            let oldPlaycounts = {
              date: k + 1 + '' + date.substring(1, date.length),
              data: 0
            }
            artist.playcounts.push(oldPlaycounts)
          }

          artist.playcounts.push(playcounts)
          self.allArtists.push(artist)
        }
      } else {
        artist.playcounts.push(playcounts)
        self.allArtists.push(artist)
      }
    },
    fetchWeeks: function (dataArr, date, month) {
      let self = this

      dataArr.forEach(function (weeklyArtistResponse, index) {
        let data = JSON.parse(weeklyArtistResponse.body).weeklyartistchart.artist
        let dataLength = data.length
        let x = 0
        while (x < dataLength) {
          let artist = data[x]
          let myArtist = {
            name: artist.name,
            totalPlaycounts: parseInt(artist.playcount),
            url: artist.url,
            mbid: artist.mbid,
            playcounts: []
          }
          self.addArtist(myArtist, date, index, month)
          x++
        }
      })
    },
    fetchMonthlyArtistChart: function (arrayPromises, date, month) {
      let self = this

      // Executes when all promises are done
      Promise.all(arrayPromises).then(function (dataArr) {
        self.fetchWeeks(dataArr, date, month)
        self.allArtists = self.allArtists.sort(function (a, b) {
          return b.totalPlaycounts - a.totalPlaycounts
        })
        // Everything is done we store 20 elements
        self.artists = self.allArtists.slice(0, 20)
        // Check highestArtistPlaycount
        self.artists.forEach(function (artist, index) {
          artist.playcounts.forEach(function (month, index) {
            if (self.highestArtistPlaycount < month.data) {
              self.highestArtistPlaycount = month.data
            }
          })
        })
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
    this.getMonthlyArtistChart(0, 2016)
    this.getMonthlyArtistChart(1, 2016)
    this.getMonthlyArtistChart(2, 2016)
    this.getMonthlyArtistChart(3, 2016)
    this.getMonthlyArtistChart(4, 2016)
    this.getMonthlyArtistChart(5, 2016)
    this.getMonthlyArtistChart(6, 2016)
    this.getMonthlyArtistChart(7, 2016)
    // this.getMonthlyArtistChart(8, 2016)
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

h1 {
  color: #42b983;
}

.artists {
  clear: both;
}

.artists > li {
}

</style>
