<template>
  <v-row>
    <v-col>
      <!-- Desktop Layout -->
      <div v-if="!$vuetify.breakpoint.smAndDown" class="info-container">
        <v-fade-transition>
          <div class="info-section" v-if="!isLoading && !error">
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
          <div v-else-if="error" class="error-state">
            <v-icon color="error">mdi-alert-circle</v-icon>
            <p>{{ error }}</p>
            <v-btn small color="primary" @click="fetchQuote">Retry</v-btn>
          </div>
          <div v-else class="loading-state">
            <v-progress-circular
              indeterminate
              color="primary"
              size="24"
            ></v-progress-circular>
          </div>
        </v-fade-transition>
      </div>

      <!-- Mobile Layout -->
      <v-card v-else dark color="black" class="mobile-quote-card">
        <v-card-text>
          <div class="text-subtitle-1 blue--text mb-2">
            <v-icon small color="blue" class="mr-1">
              mdi-format-quote-close
            </v-icon>
            Random quote:
          </div>
          <v-skeleton-loader
            v-if="isLoading"
            type="text@3"
            class="mt-4"
          ></v-skeleton-loader>
          <div v-else-if="error" class="error-state">
            <v-icon color="error">mdi-alert-circle</v-icon>
            <p>{{ error }}</p>
            <v-btn small color="primary" @click="fetchQuote">Retry</v-btn>
          </div>
          <div v-else class="teal--text text--lighten-1">
            {{ quote.text }}
            <div class="text-right mt-2">— {{ quote.author || 'Unknown' }}</div>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import axios from 'axios'

export default {
  name: 'RightSideBar',

  data() {
    return {
      isLoading: true,
      quote: {},
      error: null,
    }
  },

  methods: {
    async fetchQuote() {
      this.error = null
      this.isLoading = true
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_API_ENDPOINT}/quote/random`
        )
        if (response?.data) {
          this.quote = response.data
        }
      } catch (error) {
        this.error = 'Failed to load quote. Please try again.'
        console.error('Error:', error)
      } finally {
        this.isLoading = false
      }
    },
  },

  async mounted() {
    try {
      await this.fetchQuote()
    } catch (error) {
      console.error('Error loading data:', error)
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

.info-label {
  font-size: 0.9em;
  color: #4fc3f7;
  opacity: 0.9;
  font-weight: 500;
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

.error-state {
  text-align: center;
  padding: 20px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
}

.loading-state {
  text-align: center;
  padding: 20px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
}

/* Add mobile-specific styles */
.mobile-quote-card {
  border: none;
  border-radius: 12px;
  background: rgba(13, 71, 71, 0.6) !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25) !important;
  margin: 0 8px 16px;
  transition: background 0.3s ease;
}

.mobile-quote-card:hover {
  background: rgba(19, 106, 106, 0.75) !important;
}

.mobile-quote-card .v-card-text {
  padding: 16px;
}

/* Improve mobile quote text styles */
.mobile-quote-card .teal--text {
  font-size: 1.1rem;
  line-height: 1.5;
  font-style: italic;
}

.mobile-quote-card .text-right {
  font-size: 0.9rem;
  opacity: 0.9;
  margin-top: 12px;
}

/* Better error state for mobile */
.mobile-quote-card .error-state {
  text-align: center;
  padding: 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
}

.mobile-quote-card .error-state .v-btn {
  margin-top: 8px;
}

/* Improve skeleton loader appearance */
.mobile-quote-card .v-skeleton-loader {
  background: rgba(255, 255, 255, 0.05) !important;
}

@media (max-width: 600px) {
  .v-row {
    margin: 0; /* Remove default row margins on mobile */
  }

  .v-col {
    padding: 0; /* Remove default column padding on mobile */
  }
}
</style>
