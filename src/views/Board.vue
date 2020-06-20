<template>
  <div class="board">
    <div id="board-messages">
      somebody1: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas dictum, dui vel tristique convallis, leo lorem faucibus lorem, a molestie mauris est sed magna. Sed ac ipsum sed elit bibendum blandit. Nam convallis egestas sem, nec scelerisque risus hendrerit tempor. Vivamus magna urna, auctor ut turpis quis, ornare lacinia nunc. Mauris eget pellentesque lacus, ultricies venenatis erat. Vestibulum dictum sapien non tortor efficitur, vel auctor erat finibus. Interdum et malesuada fames ac ante ipsum primis in faucibus.
      <hr />ass2: Phasellus eros risus, bibendum sit amet egestas id, venenatis in turpis. Pellentesque gravida, nibh quis rutrum lobortis, sem diam pulvinar lorem, vitae lobortis diam sapien eget ante. Proin aliquam lobortis dui. Nullam posuere felis enim, et molestie lectus facilisis sit amet. Duis finibus nisl quis sapien faucibus tincidunt. Nulla finibus erat ut euismod pretium. Sed imperdiet, magna ut euismod finibus, turpis urna aliquet libero, quis tempus neque odio sit amet lorem. Nam mauris diam, vehicula quis nunc non, ultrices efficitur justo. Vestibulum ut odio elementum, dictum elit vitae, porttitor augue. Praesent aliquet facilisis mauris, ac pulvinar magna rutrum non. Aenean et neque non eros commodo efficitur.
      <hr />dickhead3: Aliquam dictum imperdiet quam, eu bibendum ex dapibus in. Pellentesque vel orci arcu. Quisque convallis, lectus sed sollicitudin cursus, urna eros tincidunt lorem, pharetra lacinia dolor sapien eu purus. Vestibulum quam est, condimentum sit amet leo sit amet, semper dapibus massa. Fusce quis nisi rutrum, commodo lacus nec, tristique felis. Etiam accumsan tellus id libero cursus, vel suscipit risus fermentum. Aenean placerat congue massa, vehicula feugiat leo suscipit ut. Nam a arcu neque. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
    </div>
    <div id="board-controls">
      <v-form>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="message" outlined clearable label="Message" type="text">
                <template v-slot:prepend>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on">mdi-help-circle-outline</v-icon>
                    </template>
                    I'm a tooltip
                  </v-tooltip>
                </template>
                <template v-slot:append>
                  <v-fade-transition leave-absolute>
                    <v-progress-circular v-if="loading" size="24" color="info" indeterminate></v-progress-circular>
                    <img
                      v-else
                      width="24"
                      height="24"
                      src="https://cdn.vuetifyjs.com/images/logos/v-alt.svg"
                      alt
                    />
                  </v-fade-transition>
                </template>
                <template v-slot:append-outer>
                  <v-menu style="top: -12px" offset-y>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn v-bind="attrs" v-on="on">
                        <v-icon left>mdi-menu</v-icon>Menu
                      </v-btn>
                    </template>
                    <v-card>
                      <v-card-text class="pa-6">
                        <v-btn large flat color="primary" @click="clickMe">
                          <v-icon left>mdi-target</v-icon>Click me
                        </v-btn>
                      </v-card-text>
                    </v-card>
                  </v-menu>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    message: 'Hey!',
    loading: false
  }),
  methods: {
    clickMe () {
      this.loading = true
      this.message = 'Wait for it...'
      setTimeout(() => {
        this.loading = false
        this.message = 'Youve clicked me!'
      }, 2000)
    }
  }
}
</script>

<style scoped>
#board-messages {
  background-color: rgb(32, 185, 134);
  text-align: left;

  margin-left: 10%;
  margin-right: 10%;
  margin-bottom: 20%;

  padding-top: 15px;
  padding-bottom: 15px;
  padding-right: 5px;
  padding-left: 5px;

  min-height: 650px;
  max-height: 700px;

  border-radius: 5px;
  overflow: auto;
}
</style>
