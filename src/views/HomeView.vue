<template>
  <v-container fluid class="pa-0">
    <!-- Mobile Layout -->
    <v-row v-if="isMobile">
      <v-col cols="12" class="px-4 py-2">
        <v-card
          :dark="$vuetify.theme.dark"
          :color="$vuetify.theme.dark ? 'black' : 'white'"
          class="mb-4 custom-card"
        >
          <v-card-text class="text-center">
            <h2
              :class="
                $vuetify.theme.dark
                  ? 'text-h4 blue--text text--lighten-1 mb-4'
                  : 'text-h4 blue--text text--darken-2 mb-4'
              "
            >
              {{ headerTitle }}
            </h2>

            <v-avatar :size="avatarSize" class="mb-4">
              <v-img
                id="my-image"
                alt="serj-tubin"
                :src="myImageSrc"
                class="rounded-circle"
              />
            </v-avatar>

            <h3
              :class="
                $vuetify.theme.dark
                  ? 'text-h5 blue--text text--lighten-1 mb-2'
                  : 'text-h5 blue--text text--darken-1 mb-2'
              "
            >
              {{ subTitle }}
            </h3>
          </v-card-text>
        </v-card>

        <!-- Weather and Location Card -->
        <v-card
          :color="$vuetify.theme.dark ? 'black' : 'white'"
          class="mb-4 custom-card"
        >
          <v-card-text>
            <v-row dense>
              <v-col cols="6">
                <div class="text-subtitle-1 blue--text">
                  <v-icon small color="blue" class="mr-1">
                    mdi-map-marker
                  </v-icon>
                  Request from:
                </div>
                <div class="text-body-1 blue--text text--lighten-1">
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
                <div class="text-body-1 blue--text text--lighten-1">
                  scattered clouds
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Quote is now handled by RightSideBar component -->
        <RightSideBar />

        <!-- Blog Posts -->
        <BlogsList title="Recent Posts" class="mt-4" />
      </v-col>
    </v-row>

    <!-- Desktop/Laptop Layout -->
    <v-row v-else>
      <!-- Increased sidebar width back to 3 columns -->
      <v-col cols="3" class="pa-0 pl-3">
        <div class="side-panel-container">
          <LeftSideBar />
        </div>
      </v-col>

      <!-- Main content takes 6 columns -->
      <v-col cols="6" class="pa-4">
        <v-card
          :color="$vuetify.theme.dark ? 'black' : 'white'"
          class="mb-6 custom-card main-content-card"
        >
          <v-card-text class="text-center">
            <h2
              :class="
                $vuetify.theme.dark
                  ? 'text-h3 blue--text text--lighten-1 mb-4'
                  : 'text-h3 blue--text text--darken-2 mb-4'
              "
            >
              {{ headerTitle }}
            </h2>

            <v-avatar :size="avatarSize" class="mb-4">
              <v-img
                id="my-image"
                alt="serj-tubin"
                :src="myImageSrc"
                class="rounded-circle"
              />
            </v-avatar>

            <h3
              :class="
                $vuetify.theme.dark
                  ? 'text-h4 blue--text text--lighten-1'
                  : 'text-h4 blue--text text--darken-1'
              "
            >
              {{ subTitle }}
            </h3>
          </v-card-text>
        </v-card>

        <BlogsList title="Recent Posts" class="mt-6" />
      </v-col>

      <v-col cols="3" class="pa-0">
        <div class="side-panel-container">
          <RightSideBar />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LeftSideBar from '@/components/LeftSideBar.vue'
import RightSideBar from '@/components/RightSideBar.vue'
import BlogsList from '@/components/BlogsList.vue'
import myImage from '@/assets/ja-2022-dec.jpg'

export default {
  name: 'HomeView',

  components: {
    LeftSideBar,
    RightSideBar,
    BlogsList,
  },

  data() {
    return {
      myImageSrc: myImage,
    }
  },

  computed: {
    isMobile() {
      return this.$vuetify.display.smAndDown.value
    },

    headerTitle() {
      return 'Work in constant progress 👨🏼‍💻🛠'
    },

    subTitle() {
      return 'A personal tech sandbox'
    },

    avatarSize() {
      return this.isMobile ? 150 : 200
    },
  },
}
</script>

<style scoped>
/* Mobile-specific styles */
@media (max-width: 600px) {
  .v-card.custom-card {
    border: none;
    border-radius: 12px;
    margin: 0 8px 16px;
  }
  
  .theme--dark .v-card.custom-card {
    background: rgba(42, 52, 65, 0.9) !important;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25) !important;
  }
  
  .theme--light .v-card.custom-card {
    background: rgba(255, 255, 255, 0.9) !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
  }

  /* Only apply hover effect to interactive cards */
  .blog-post:hover,
  .mobile-quote-card:hover {
    background: rgba(64, 169, 255, 0.25) !important;
    transition: background 0.3s ease;
  }

  #my-image {
    border: 3px solid #40a9ff;
    transition: transform 0.3s ease;
  }

  #my-image:hover {
    transform: scale(1.05);
  }

  .text-h4 {
    font-size: 1.75rem !important;
    line-height: 1.3;
  }

  .text-h5 {
    font-size: 1.25rem !important;
    line-height: 1.4;
  }

  /* Improve spacing in cards */
  .v-card-text {
    padding: 16px !important;
  }

  /* Better icon alignment */
  .v-icon.small {
    margin-bottom: 2px;
  }
}

/* Desktop styles */
@media (min-width: 601px) {
  .side-panel-container {
    margin-top: 100px;
  }

  #my-image {
    border-radius: 50%;
    border: 4px solid #40a9ff;
    transition: all 0.3s ease;
  }

  #my-image:hover {
    transform: scale(1.05);
    box-shadow: 0 0 15px rgba(64, 169, 255, 0.6);
  }

  /* New styles for blog list on desktop */
  .blog-list-desktop {
    max-width: 100%;
    margin: 0 auto;
  }

  .blog-list-desktop :deep(.v-card) {
    width: 100%;
    margin-bottom: 1.5rem;
  }

  /* Ensure content is properly centered */
  .v-card-text {
    padding: 2rem;
  }

  /* Larger text for desktop view */
  .text-h3 {
    font-size: 2.5rem !important;
    margin-bottom: 2rem;
  }

  .text-h4 {
    font-size: 1.8rem !important;
    margin-top: 2rem;
  }
}

/* Override Vuetify's dark theme classes for light theme */
.theme--light .main-content-card.v-theme--dark {
  color: #212121 !important;
}

.theme--light .main-content-card.v-theme--dark .v-card-text {
  color: #212121 !important;
}

.theme--light .main-content-card.v-theme--dark h2,
.theme--light .main-content-card.v-theme--dark h3 {
  color: inherit !important;
}
</style>
