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

        <!-- Quote is now handled by RightSideBar component -->
        <RightSideBar />

        <!-- Blog Posts -->
        <BlogsList title="Recent Posts" class="mt-4" />
      </v-col>
    </v-row>

    <!-- Desktop/Laptop Layout -->
    <v-row v-else>
      <!-- Increased sidebar width back to 3 columns -->
      <v-col cols="3" class="pa-0">
        <LeftSideBar />
      </v-col>

      <!-- Main content takes 6 columns -->
      <v-col cols="6" class="pa-4">
        <v-card dark color="black" class="mb-6">
          <v-card-text class="text-center">
            <h2 class="text-h3 teal--text text--lighten-1 mb-4">
              Work in constant progress 👨🏼‍💻🛠
            </h2>

            <v-avatar size="200" class="mb-4">
              <v-img
                id="my-image"
                alt="serj-tubin"
                src="../assets/ja-2022-dec.jpg"
                class="rounded-circle"
              />
            </v-avatar>

            <h3 class="text-h4 teal--text text--lighten-1">
              A personal tech sandbox
            </h3>
          </v-card-text>
        </v-card>

        <BlogsList title="Recent Posts" class="mt-6" />
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

/* Desktop styles */
@media (min-width: 601px) {
  #my-image {
    border-radius: 50%;
    border: 4px solid #26a69a;
    transition: all 0.3s ease;
  }

  #my-image:hover {
    transform: scale(1.05);
    box-shadow: 0 0 15px rgba(38, 166, 154, 0.5);
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
</style>
