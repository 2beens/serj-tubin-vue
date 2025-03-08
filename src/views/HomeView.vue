<template>
  <v-container fluid class="pa-0">
    <!-- Mobile Layout -->
    <v-row v-if="$vuetify.breakpoint.smAndDown">
      <v-col cols="12" class="px-4 py-2">
        <v-card dark color="black" class="mb-4">
          <v-card-text class="text-center">
            <h2 class="text-h4 teal--text text--lighten-1 mb-4">
              Work in constant progress 👨🏼‍💻🛠
            </h2>

            <v-avatar size="150" class="mb-4">
              <v-img
                id="my-image"
                alt="serj-tubin"
                src="../assets/ja-2022-dec.jpg"
                class="rounded-circle"
              />
            </v-avatar>

            <h3 class="text-h5 teal--text text--lighten-1 mb-2">
              A personal tech sandbox
            </h3>
          </v-card-text>
        </v-card>

        <!-- Weather and Location Card -->
        <v-card dark color="black" class="mb-4">
          <v-card-text>
            <v-row dense>
              <v-col cols="6">
                <div class="text-subtitle-1 blue--text">
                  <v-icon small color="blue" class="mr-1">
                    mdi-map-marker
                  </v-icon>
                  Request from:
                </div>
                <div class="text-body-1 teal--text text--lighten-1">
                  Berlin, DE
                </div>
              </v-col>
              <v-col cols="6">
                <div class="text-subtitle-1 blue--text">
                  <v-icon small color="blue" class="mr-1">
                    mdi-weather-cloudy
                  </v-icon>
                  Local weather:
                </div>
                <div class="text-body-1 teal--text text--lighten-1">
                  scattered clouds
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Quote Card -->
        <v-card dark color="black" class="mb-4">
          <v-card-text>
            <div class="text-subtitle-1 blue--text mb-2">
              <v-icon small color="blue" class="mr-1">
                mdi-format-quote-close
              </v-icon>
              Random quote:
            </div>
            <v-skeleton-loader
              v-if="loading"
              type="text@3"
              class="mt-4"
            ></v-skeleton-loader>
            <div v-else class="teal--text text--lighten-1">
              {{ quote.text }}
              <div class="text-right mt-2">— {{ quote.author }}</div>
            </div>
          </v-card-text>
        </v-card>

        <!-- Blog Posts -->
        <BlogsList title="Recent Posts" class="mt-4" />
      </v-col>
    </v-row>

    <!-- Desktop Layout - Keep existing layout -->
    <v-row v-else>
      <v-col cols="3" class="pa-0">
        <LeftSideBar />
      </v-col>
      <v-col cols="6" class="pa-0">
        <!-- Your existing desktop layout -->
        <h2>Work in constant progress 👨🏼‍💻🛠</h2>
        <img id="my-image" alt="serj-tubin" src="../assets/ja-2022-dec.jpg" />
        <h3 style="margin: 40px 0 0">A personal tech sandbox</h3>
        <h5>* not fully adapted to small screens yet 🤷‍♂️</h5>
        <BlogsList title="Recent Posts" />
      </v-col>
      <v-col cols="3" class="pa-0">
        <RightSideBar />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LeftSideBar from '@/components/LeftSideBar.vue'
import RightSideBar from '@/components/RightSideBar.vue'
import BlogsList from '@/components/BlogsList.vue'

export default {
  name: 'HomeView',

  components: {
    LeftSideBar,
    RightSideBar,
    BlogsList,
  },

  data() {
    return {
      loading: true,
      quote: {
        text: '',
        author: '',
      },
    }
  },

  mounted() {
    // Simulate quote loading
    setTimeout(() => {
      this.loading = false
      this.quote = {
        text: 'Next year, I hope there will be even more parties, lots of holidays and just having a good time, really. Plus wing-',
        author: 'Random Quote',
      }
    }, 1000)
  },
}
</script>

<style scoped>
/* Mobile-specific styles */
@media (max-width: 600px) {
  .v-card {
    border: 1px solid rgba(38, 166, 154, 0.1);
    border-radius: 8px;
  }

  #my-image {
    border: 3px solid #26a69a;
    transition: transform 0.3s ease;
  }

  #my-image:hover {
    transform: scale(1.05);
  }

  .text-h4 {
    font-size: 1.75rem !important;
  }

  .text-h5 {
    font-size: 1.25rem !important;
  }

  .v-card {
    margin: 0 8px;
  }
}

/* Desktop styles remain unchanged */
@media (min-width: 601px) {
  #my-image {
    border-radius: 50%;
    max-width: 35%;
    height: auto;
  }

  #my-image:hover {
    box-shadow: 0 0 8px 2px rgba(0, 140, 186, 0.5);
  }
}
</style>
