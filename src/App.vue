<template>
  <div id="app">

    <!--<graph></graph> -->
    <hello></hello>
  </div>
</template>

<script>
import Hello from './components/Hello'
import Graph from './components/Graph'

export default {
  components: {
    Hello,
    Graph
  }
}
</script>

<style>
html {
  height: 100%;
}

body {

  height: 100%;
}

#app {
  color: #2c3e50;
  width: 1200px;
  font-family: Source Sans Pro, Helvetica, sans-serif;
  margin: 0 auto;
}

#app a {
  color: #42b983;
  text-decoration: none;
}

</style>
