<template>
  <v-row>
    <v-col>
      <div class="info-container">
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
  name: 'RightSideBar',

  data() {
    return {
      isLoading: true,
      quote: {},
    }
  },

  methods: {
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
      await this.fetchQuote()
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

@media (max-width: 600px) {
  .info-container {
    padding: 12px;
    margin: 8px;
  }
}
</style>
