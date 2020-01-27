<template>
  <v-app class="app">
    <v-app-bar
      app
      :flat="true"
    >
      <v-toolbar-title class="headline-2 text-uppercase" @click="goHome">
        <span>Call for </span>
        <span class="font-weight-bold">HEALTH</span>
      </v-toolbar-title>
      <v-spacer />

      <v-menu
        bottom
        left
      >
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            color="black"
            v-on="on"
          >
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item @click="gotoLogin">
            <v-list-item-title>登录/注册</v-list-item-title>
          </v-list-item>
          <v-list-item @click="gotoMe">
            <v-list-item-title>我的主页</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

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

  gotoLogin () {
    this.$router.push('/login')
  }

  gotoMe () {
    this.$router.push('/me')
  }

  goHome () {
    this.$router.replace('/')
  }
}
export default DefaultLayout
</script>

<style lang="scss" scoped>
.app{
  min-height: 100%;
}
</style>
