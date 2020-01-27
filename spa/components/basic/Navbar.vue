<template>
  <v-app-bar app flat>
    <v-toolbar-title class="headline text-uppercase" @click="toHome">
      <span>Call for </span>
      <span class="font-weight-bold">HEALTH</span>
    </v-toolbar-title>
    <v-spacer />
    <v-menu bottom left>
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          color="black"
          v-on="on"
        >
          <v-icon>{{ $icons.mdiDotsVertical }}</v-icon>
        </v-btn>
      </template>

      <v-list>
        <login-require>
          <template #action-me="{ on }">
            <v-list-item v-on="on">
              <v-list-item-title>我的主页</v-list-item-title>
            </v-list-item>
          </template>
          <template #action-login="{ on }">
            <v-list-item v-on="on">
              <v-list-item-title>
                登录/注册
              </v-list-item-title>
            </v-list-item>
          </template>
        </login-require>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
class Navbar extends Vue {
  toHome () {
    return this.$router.push(this.localePath({ name: 'index' }))
  }
}
export default Navbar
</script>
