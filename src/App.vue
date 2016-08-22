<template>
  <div id="app">
    <h1>{{ msg }}</h1>
    <div>
    <ul class="artists">
      <li v-for="item in artists" track-by="$index">
        {{ item.date }}
        <ul>
          <li v-for="artist in item.artists" track-by="$index">
            {{ artist.playcount }} : {{ artist.name }}
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
110 184
<script>
import Graph from './components/Graph'

const config = {
  baseUrl: 'http://ws.audioscrobbler.com/2.0/?',
  userName: 'Reknawn',
  apiKey: 'cd0ccd3a54f6da3e6c259d90f5ae702a',
  limitOfArtistsToFetch: 20,
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
      console.log(from)
      console.log(to)
      console.log(url)
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
      let date = (month + 1) + '/' + year

      weeks.forEach(function (week) {
        let from = '' + (month + 1) + '-' + week.start + '-' + year + ' 00:00:00'
        let to = '' + (month + 1) + '-' + week.end + '-' + year + ' 23:59:59'
        promises.push(self.getWeeklyArtistChart(from, to))
      })

      return self.fetchMonthlyArtistChart(promises, date)
    },
    // [1] Temporary way to process, there's probably a better way
    addArtists: function (artist, date) {
      let self = this
      // We only want 10 artist total
      if (self.monthsByArtist.length === 50) {
        for (var j = 0; j < self.monthsByArtist.length; j++) {
          // Check if artist is already in the array, if so add its playcount
          let anArtist = self.monthsByArtist[j]
          if (anArtist.name === artist.name) {
            console.log(date)
            console.log('%c duplicate ' + anArtist.name +
            ' added ' + artist.playcount +
            ' to ' + anArtist.playcount +
            ' = ' + (anArtist.playcount + artist.playcount),
            'color:green'
            )
            anArtist.playcount += artist.playcount

            self.monthsByArtist = self.monthsByArtist.sort(function (a, b) {
              return b.playcount - a.playcount
            })
            break
          } else {
            // Check if this artist playcount is bigger than the last of the stored ones
            if (j === (self.monthsByArtist.length - 1) && artist.playcount > anArtist.playcount) {
              console.log('%c removed ' + anArtist.name + ' for ' + artist.name + ' | ' + anArtist.playcount + ' for ' + artist.playcount, 'color:red')
              anArtist.name = artist.name
              anArtist.playcount = artist.playcount
              self.monthsByArtist = self.monthsByArtist.sort(function (a, b) {
                return b.playcount - a.playcount
              })
              break
            }
          }
          console.log('%c ' + j + ' | ' + anArtist.playcount + ' | ' + anArtist.name, 'background:#000; color:white')
        }
      } else {
        console.log('added : ' + artist.name)
        self.monthsByArtist.push(artist)
      }
    },
    // [2] Temporary way to process, there's probably a better way
    fetchWeeks: function (dataArr, date) {
      let self = this
      let totalArtists = []
      let artistsNames = []

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
          // console.log(myArtist)
          // self.addArtists(myArtist, date)

          // Search for duplicated artists from the first week's data
          if (index !== 0 && artistsNames.indexOf(myArtist.name) > -1) {
            let foundArtist = totalArtists.findIndex(
              function (obj) {
                return obj.name === myArtist.name
              })

            // In case the artist already exist, we update its playcount
            totalArtists[foundArtist].playcount += myArtist.playcount
            if (totalArtists[foundArtist].playcount > self.highestArtistPlaycount) {
              self.highestArtistPlaycount = totalArtists[foundArtist].playcount
            }
          } else {
            // Adding a new artist and refering its name in an array for the duplication test
            if (myArtist.playcount > self.highestArtistPlaycount) {
              self.highestArtistPlaycount = myArtist.playcount
            }
            artistsNames.push(myArtist.name)
            totalArtists.push(myArtist)
          }
          x++
        }
      })

      return {artistsNames, totalArtists}
    },

    fetchMonthlyArtistChart: function (arrayPromises, date) {
      let self = this

      // Executes when all promises are done
      Promise.all(arrayPromises).then(function (dataArr) {
        let artistsData = self.fetchWeeks(dataArr, date)
        let totalArtists = artistsData.totalArtists

        // When all the data has been stored we sort it by the highest play count
        totalArtists = totalArtists.sort(function (a, b) {
          return b.playcount - a.playcount
        })

        // Then we assign it to the artists array of the app's data
        //
        let myMonth = {
          date: date,
          artists: totalArtists
        }
        self.artists.push(myMonth)
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
    // this.getMonthlyArtistChart(1, 2016)
    // this.getMonthlyArtistChart(2, 2016)
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
  float:left;
}

</style>
