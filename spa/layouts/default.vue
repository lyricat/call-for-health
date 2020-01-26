<template>
  <v-app class="app">
    <v-app-bar
      app
      :flat="true"
      color="teal lighten-3"
    >
      <v-toolbar-title class="headline text-uppercase">
        <span>Call for </span>
        <span class="font-weight-bold">HEALTH</span>
      </v-toolbar-title>
      <v-spacer />
    </v-app-bar>

    <v-content>
      <nuxt />
    </v-content>
    <v-snackbar v-model="snackbar" :color="bindSnackbar.color" :timeout="3000" top>
      {{ bindSnackbar.message }}
    </v-snackbar>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Mutation, State } from 'vuex-class'

@Component
class DefaultLayout extends Vue {
  @State(state => state.app.snackbar) bindSnackbar

  @Mutation('app/setSnackbar') setSnackbar

  get snackbar () {
    return this.bindSnackbar.show
  }

  set snackbar (val) {
    this.setSnackbar(val)
  }
}
export default DefaultLayout
</script>

<style lang="scss" scoped>
.app{
  min-height: 100%;
}
</style>
