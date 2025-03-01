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

        <!-- Quote Section -->
        <v-fade-transition>
          <div class="info-section" v-if="!isLoading">
            <div class="quote-header">
              <v-icon color="primary" small class="mr-2">
                mdi-format-quote-close
              </v-icon>
              <span class="info-label">Random quote:</span>
            </div>
            <div v-if="quote.text" class="quote-content">
              <p class="quote-text">{{ quote.text }}</p>
              <p class="quote-author">— {{ quote.author || 'Unknown' }}</p>
            </div>
            <p v-else class="info-value">Loading quote...</p>
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
  name: 'SideBar',

  data() {
    return {
      locationInfo: '',
      weatherInfo: '',
      forecastIcons: [],
      isLoading: true,
      quote: {},
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

    async fetchQuote() {
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_API_ENDPOINT}/quote/random`
        )
        if (response?.data) {
          this.quote = response.data
        }
      } catch (error) {
        console.error('Error fetching quote:', error)
      }
    },
  },

  async mounted() {
    try {
      await Promise.all([
        this.fetchLocationInfo(),
        this.fetchWeatherInfo(),
        this.fetchForecast(),
        this.fetchQuote(),
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
  transition: all 0.2s ease;
  border-radius: 8px;
  padding: 4px;
  background: rgba(255, 255, 255, 0.05);
}

.weather-icon-img:hover {
  transform: scale(1.15);
  filter: brightness(1.1);
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

.quote-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.quote-content {
  padding-left: 26px;
}

.quote-text {
  color: #26a69a;
  font-size: 1.1em;
  line-height: 1.4;
  font-style: italic;
  margin-bottom: 12px;
}

.quote-author {
  color: #4fc3f7;
  font-size: 0.9em;
  text-align: right;
  opacity: 0.9;
}
</style>
