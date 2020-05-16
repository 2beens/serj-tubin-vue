<template>
  <div id="sidebar">
    <div id="geo-info">
        You are (probably) requesting from:
        <p id="geo-city"></p>
    </div>
    <div id="weather-info">
        Weather there:
        <p id="weather-now"></p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'SideBar',
  mounted: function () {
    document.getElementById('geo-info').style.display = 'none'
    document.getElementById('weather-info').style.display = 'none'

    axios
      .get('https://www.serj-tubin.com/api/whereami')
      .then(response => {
        if (response === null || response.data === null) {
          console.error('received null response / data')
          return
        }
        const geoInfo = response.data
        document.getElementById('geo-city').innerHTML = geoInfo.city + ', ' + geoInfo.country
        document.getElementById('geo-info').style.display = 'block'
      })
      .catch(error => {
        console.log(error)
      })

    axios
      .get('https://www.serj-tubin.com/api/weather/current')
      .then(response => {
        if (response === null || response.data === null) {
          console.error('received null response / data')
          return
        }
        const weatherData = response.data
        document.getElementById('weather-now').innerHTML = weatherData.weather
        document.getElementById('weather-info').style.display = 'block'
      })
      .catch(error => {
        console.log(error)
      })
  }
}
</script>

<style scoped>
#geo-city {
    color: #42b983;
}
#weather-now {
    color: #42b983;
}
#sidebar {
    position: absolute;
    top: 3%;
    left: 3%;
    float: left;
    padding: 10px;
    /* background-color: aliceblue; */
}
</style>
