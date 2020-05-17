<template>
  <div id="sidebar">
    <div id="geo-info">
        You are (probably) requesting from:
        <p id="geo-city"></p>
    </div>
    <div id="weather-info">
        Weather there:
        <p id="weather-now"></p>
        Tomorrow:
        <div id="weather-tomorrow">
        </div>
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

        const weatherDescriptions = []
        response.data.forEach(function (item, i, array) {
          weatherDescriptions.push(item.description)
        })

        if (weatherDescriptions.length > 0) {
          document.getElementById('weather-now').innerHTML = weatherDescriptions.join(', ')
          document.getElementById('weather-info').style.display = 'block'
        }
      })
      .catch(error => {
        console.log(error)
      })

    axios
      .get('https://www.serj-tubin.com/api/weather/tomorrow')
      .then(response => {
        if (response === null || response.data === null) {
          console.error('received null response / data')
          return
        }

        const icons = getIconsFromWeatherData(response.data)
        icons.forEach(function (item, i, wArray) {
          const weatherIcon = document.createElement('img')
          weatherIcon.classList.add('weather-icon-img')
          weatherIcon.src = 'https://openweathermap.org/img/wn/' + icons[i] + '@2x.png'
          weatherIcon.width = 30
          document.getElementById('weather-tomorrow').appendChild(weatherIcon)
        })
      })
      .catch(error => {
        console.log(error)
      })
  }
}

function getIconsFromWeatherData (weatherData) {
  const icons = []
  weatherData.forEach(function (item, i, wArray) {
    const descriptions = weatherData[i].descriptions
    descriptions.forEach(function (item, i, dArray) {
      icons.push(descriptions[i].icon)
    })
  })
  return icons
}
</script>

<style scoped>
.weather-icon-img {
  display: none;
  width: 15px;
  height: auto;
}
#weather-tomorrow {
  margin-top: 5px;
}
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
