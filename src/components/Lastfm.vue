<template>
  <h1>{{ msg }}</h1>
  <button v-on:click="getData">Dispatch Event</button>
  <div>
    <ul class="artists">
      <li v-for="artist in artists" track-by="$index">
        <pre>{{ artist | json }}</pre>
      </li>
    </ul>
  </div>
</template>
<script>
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
  data () {
    return {
      msg: 'ryty',
      config: config,
      allArtists: [],
      artists: [],
      highestArtistPlaycount: 0,
      monthsByArtist: [],
      done: false
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

      return self.getWeekly(config.methods.getWeeklyArtistChart, config.userName, config.apiKey, from, to)
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

      return self.fetchMonthlyArtistChart(promises, date, month, year)
    },
    getYearlyArtistChart: function (year, monthStart = 0, monthEnd = 12) {
      let self = this

      for (var i = monthStart; i < monthEnd; i++) {
        self.getMonthlyArtistChart(i, year)
      }
    },
    addArtist: function (artist, date, currentWeek, month, year) {
      let self = this
      let playcounts = {
        date: date,
        data: artist.totalPlaycounts
      }
      let foundArtist = false

      // Action for not first month && not first week
      var i = 0
      while (i < self.allArtists.length && !foundArtist) {
        let currentArtist = self.allArtists[i]

        // Check if the artist to add is already in the array
        if (currentArtist.name === artist.name) {
          foundArtist = true
          currentArtist.totalPlaycounts += artist.totalPlaycounts
          currentArtist.playcounts[month].data += playcounts.data
        }
        i++
      }
      if (!foundArtist) {
        let monthsFiller = []
        for (var y = 0; y < 12; y++) {
          monthsFiller.push({
            date: (y + 1) + '/' + year,
            data: 0
          })
        }
        artist.playcounts = monthsFiller
        artist.playcounts[month].data += playcounts.data
        self.allArtists.push(artist)
      }
    },
    fetchWeeks: function (dataArr, date, month, year) {
      let self = this

      dataArr.forEach(function (weeklyArtistResponse, index) {
        let response = weeklyArtistResponse
        while (response.status === 500) {
          response = self.$http.get(response.url, {})
        }
        let data = JSON.parse(response.body).weeklyartistchart.artist
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
          self.addArtist(myArtist, date, index, month, year)
          x++
        }
      })
    },
    fetchMonthlyArtistChart: function (arrayPromises, date, month, year) {
      let self = this

      // Executes when all promises are done
      return Promise.all(arrayPromises).then(function (dataArr) {
        self.fetchWeeks(dataArr, date, month, year)
        self.allArtists = self.allArtists.sort(function (a, b) {
          return b.totalPlaycounts - a.totalPlaycounts
        })

        self.msg = 'We gucci for : ' + month
      }).catch(console.log.bind(console))
    },
    notify: function () {
      let self = this
      self.$dispatch('artists', self.artists)
      self.$dispatch('highestArtistPlaycount', self.highestArtistPlaycount)
    },
    getData: function () {
      let self = this
      let promisesArray = []
      promisesArray.push(self.getMonthlyArtistChart(0, 2016))
      promisesArray.push(self.getMonthlyArtistChart(1, 2016))
      promisesArray.push(self.getMonthlyArtistChart(2, 2016))
      promisesArray.push(self.getMonthlyArtistChart(3, 2016))
      promisesArray.push(self.getMonthlyArtistChart(4, 2016))
      promisesArray.push(self.getMonthlyArtistChart(5, 2016))
      promisesArray.push(self.getMonthlyArtistChart(6, 2016))
      promisesArray.push(self.getMonthlyArtistChart(7, 2016))
      promisesArray.push(self.getMonthlyArtistChart(8, 2016))

      Promise.all(promisesArray).then(function () {
        // Everything is done we store 20 elements
        self.artists = self.allArtists.slice(0, self.config.limitOfArtistsToFetch)

        // Check highestArtistPlaycount
        self.artists.forEach(function (artist, index) {
          artist.playcounts.forEach(function (month, index) {
            if (self.highestArtistPlaycount < month.data) {
              self.highestArtistPlaycount = month.data
            }
          })
        })
        self.notify()
        self.msg = 'all done'
      })
    }
  }
}
</script>
<style>

h1 {
  color: #42b983;
}

ul {
  list-style: none;
}

.artists {
  clear: both;
  text-align: center;

}

.artists > li {
  float: left;
  padding: 15px;
  width: 15%;
  font-size:11px;
}

</style>
