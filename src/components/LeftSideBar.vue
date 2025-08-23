<template>
  <v-row>
    <v-col>
      <!-- Location and Weather Info in one row -->
      <v-fade-transition>
        <div
          class="info-section weather-info-container"
          :class="$vuetify.theme.dark ? 'theme--dark' : 'theme--light'"
          v-if="!isLoading"
        >
          <v-row no-gutters class="info-row">
            <v-col cols="6" class="location-col">
              <div class="location-wrapper">
                <v-icon color="primary" small class="mr-2">
                  mdi-map-marker
                </v-icon>
                <span class="info-label">Request from:</span>
              </div>
              <p class="info-value location-value">
                {{ locationInfo || 'Unknown location' }}
              </p>
            </v-col>
            <v-col cols="6" class="weather-col">
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
            </v-col>
          </v-row>

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
        <div v-else class="info-section weather-info-container">
          <v-skeleton-loader type="text" class="mt-2"></v-skeleton-loader>
        </div>
      </v-fade-transition>
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
.weather-info-container {
  padding: 18px;
  margin: 0 12px; /* Balanced margins since column now has left padding */
  border-radius: 8px;
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

/* Dark theme weather info container */
.theme--dark .weather-info-container {
  background: rgba(38, 166, 154, 0.08);
  border-color: rgba(38, 166, 154, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

/* Light theme weather info container */
.theme--light .weather-info-container {
  background: rgba(255, 255, 255, 0.9);
  border-color: rgba(25, 118, 210, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.info-section {
  margin-bottom: 12px;
  padding: 10px;
  border-radius: 6px;
  transition: all 0.3s ease;
  display: block;
  border: 1px solid transparent;
}

/* Dark theme info sections */
.theme--dark .info-section {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.1);
}

.theme--dark .info-section:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(38, 166, 154, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

/* Light theme info sections */
.theme--light .info-section {
  background: rgba(25, 118, 210, 0.04);
  border-color: rgba(25, 118, 210, 0.15);
}

.theme--light .info-section:hover {
  background: rgba(25, 118, 210, 0.08);
  border-color: rgba(25, 118, 210, 0.25);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(25, 118, 210, 0.15);
}

.location-wrapper,
.weather-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid transparent;
}

/* Dark theme headers */
.theme--dark .location-wrapper,
.theme--dark .weather-header {
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

/* Light theme headers */
.theme--light .location-wrapper,
.theme--light .weather-header {
  border-bottom-color: rgba(25, 118, 210, 0.15);
}

.info-label {
  font-size: 0.8em;
  opacity: 0.9;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Dark theme labels */
.theme--dark .info-label {
  color: #4fc3f7;
}

/* Light theme labels */
.theme--light .info-label {
  color: #1976d2;
}

.info-value {
  margin: 6px 0;
  font-size: 0.95em;
  font-weight: 500;
  letter-spacing: 0.2px;
  line-height: 1.3;
}

/* Dark theme values */
.theme--dark .info-value {
  color: #26a69a;
}

/* Light theme values */
.theme--light .info-value {
  color: #1565c0;
}

.info-row {
  margin: 0;
}

.location-col,
.weather-col {
  padding: 0 8px;
}

.location-col {
  padding-left: 0;
}

.weather-col {
  padding-right: 0;
}

.location-value {
  text-align: center;
  padding-left: 0;
}

.weather-current,
.weather-forecast {
  margin-bottom: 12px;
}

.weather-value {
  text-align: center;
  padding-left: 0;
}

.weather-icons {
  display: flex;
  gap: 6px;
  margin-top: 8px;
  padding-left: 0;
  justify-content: center;
  flex-wrap: wrap;
}

.weather-icon-img {
  filter: brightness(0.95);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 4px;
  position: relative;
  width: 24px;
  height: 24px;
}

.weather-icon-img:hover {
  transform: scale(1.1) translateY(-1px);
  filter: brightness(1.1);
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
  .weather-info-container {
    padding: 14px;
    margin: 6px;
  }

  .info-section {
    padding: 8px;
    margin-bottom: 10px;
  }

  .info-row {
    flex-direction: column;
  }

  .location-col,
  .weather-col {
    padding: 0;
    margin-bottom: 12px;
  }

  .weather-col {
    margin-bottom: 0;
  }

  .weather-icons {
    justify-content: center;
    padding-left: 0;
    gap: 4px;
  }

  .location-value,
  .weather-value {
    padding-left: 0;
    text-align: center;
  }

  .location-wrapper,
  .weather-header {
    justify-content: center;
    margin-bottom: 6px;
  }
}

.weather-current {
  margin-bottom: 8px;
}

.weather-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}
</style>
