<template>
  <v-row>
    <v-col>
      <div class="info-container">
        <!-- Location Info -->
        <v-fade-transition>
          <div class="info-section" v-if="!isLoading">
            <div class="location-wrapper">
              <v-icon color="primary" small class="mr-2">mdi-map-marker</v-icon>
              <span class="info-label">Request from:</span>
            </div>
            <p class="info-value location-value">
              {{ locationInfo || 'Unknown location' }}
            </p>
          </div>
          <div v-else class="info-section">
            <v-skeleton-loader type="text" class="mt-2"></v-skeleton-loader>
          </div>
        </v-fade-transition>

        <!-- Weather Info -->
        <v-fade-transition>
          <div class="info-section" v-if="!isLoading">
            <div class="weather-current">
              <div class="weather-header">
                <v-icon color="primary" small class="mr-2">
                  mdi-weather-partly-cloudy
                </v-icon>
                <span class="info-label">Local weather:</span>
              </div>
              <p class="info-value weather-value">
                {{ weatherInfo || 'Weather data unavailable' }}
              </p>
            </div>

            <div v-if="showForecast" class="weather-forecast">
              <div class="weather-header">
                <v-icon color="primary" small class="mr-2">
                  mdi-calendar-clock
                </v-icon>
                <span class="info-label">Tomorrow's forecast:</span>
              </div>
              <div class="weather-icons">
                <v-img
                  v-for="(icon, index) in forecastIcons"
                  :key="index"
                  :src="getWeatherIconUrl(icon)"
                  :alt="'Weather icon ' + (index + 1)"
                  width="30"
                  class="weather-icon-img"
                />
              </div>
            </div>
          </div>
          <div v-else class="info-section">
            <v-skeleton-loader type="text" class="mt-2"></v-skeleton-loader>
          </div>
        </v-fade-transition>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import axios from 'axios'

export default {
  name: 'LeftSideBar',

  data() {
    return {
      locationInfo: '',
      weatherInfo: '',
      forecastIcons: [],
      isLoading: true,
    }
  },

  computed: {
    showForecast() {
      return this.forecastIcons.length > 0
    },
  },

  methods: {
    getWeatherIconUrl(icon) {
      return `https://openweathermap.org/img/wn/${icon}@2x.png`
    },

    async fetchLocationInfo() {
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_API_ENDPOINT}/whereami`
        )
        if (response?.data) {
          const { city, country } = response.data
          this.locationInfo = `${city}, ${country}`
        }
      } catch (error) {
        console.error('Error fetching location:', error)
      }
    },

    async fetchWeatherInfo() {
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_API_ENDPOINT}/weather/current`
        )
        if (response?.data) {
          this.weatherInfo = response.data
            .map((item) => item.description)
            .join(', ')
        }
      } catch (error) {
        console.error('Error fetching current weather:', error)
      }
    },

    async fetchForecast() {
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_API_ENDPOINT}/weather/tomorrow`
        )
        if (response?.data) {
          this.forecastIcons = response.data.flatMap((item) =>
            item.descriptions.map((desc) => desc.icon)
          )
        }
      } catch (error) {
        console.error('Error fetching forecast:', error)
      }
    },
  },

  async mounted() {
    try {
      await Promise.all([
        this.fetchLocationInfo(),
        this.fetchWeatherInfo(),
        this.fetchForecast(),
      ])
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      this.isLoading = false
    }
  },
}
</script>

<style scoped>
.info-container {
  padding: 20px;
  background: rgba(38, 166, 154, 0.05);
  border-radius: 12px;
  backdrop-filter: blur(8px);
}

.info-section {
  margin-bottom: 28px;
  padding: 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  display: block;
}

.info-section:hover {
  background: rgba(255, 255, 255, 0.08);
}

.location-wrapper,
.weather-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.info-label {
  font-size: 0.9em;
  color: #4fc3f7;
  opacity: 0.9;
  font-weight: 500;
}

.info-value {
  color: #26a69a;
  margin: 8px 0;
  font-size: 1.1em;
  font-weight: 500;
  letter-spacing: 0.3px;
}

.location-value {
  padding-left: 26px; /* Aligns with the icon above */
}

.weather-current,
.weather-forecast {
  margin-bottom: 20px;
}

.weather-value {
  padding-left: 26px;
}

.weather-icons {
  display: flex;
  gap: 10px;
  margin-top: 12px;
  padding-left: 26px;
  flex-wrap: wrap;
}

.weather-icon-img {
  filter: brightness(0.95);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 8px;
  padding: 4px;
  background: rgba(255, 255, 255, 0.05);
  position: relative;
}

.weather-icon-img:hover {
  transform: scale(1.15) translateY(-2px);
  filter: brightness(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* Add tooltip on hover */
.weather-icon-img::after {
  content: attr(alt);
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8em;
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
  white-space: nowrap;
}

.weather-icon-img:hover::after {
  opacity: 1;
}

@media (max-width: 600px) {
  .info-container {
    padding: 12px;
    margin: 8px;
  }

  .weather-icons {
    justify-content: center;
  }
}

.weather-current {
  margin-bottom: 20px;
}

.weather-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}
</style>
