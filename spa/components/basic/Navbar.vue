<template>
  <v-app-bar app flat>
    <v-toolbar-title class="headline-2 text-uppercase" @click="toHome">
      <span class="font-weight-bold">新冠</span>
      <span>疫情物资互助</span>
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
        <v-list-item @click="toHome">
          <v-list-item-title>首页</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="showPendings" @click="toPendings">
          <v-list-item-title>待审核列表</v-list-item-title>
        </v-list-item>
        <login-require>
          <template #action-me="{ on }">
            <v-list-item v-on="on">
              <v-list-item-title>我的信息</v-list-item-title>
            </v-list-item>
            <v-list-item @click="handleLogout">
              <v-list-item-title>退出登录</v-list-item-title>
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
import { Action, Getter } from 'vuex-class'

@Component
class Navbar extends Vue {
  @Getter('user/passedKyc') passedKyc

  @Getter('user/isVolunteer') isVolunteer

  @Action('user/logout') logout

  get showPendings () {
    return this.passedKyc && this.isVolunteer
  }

  handleLogout () {
    this.logout()
    this.toHome()
  }

  toPendings () {
    this.$router.push(this.localePath({ name: 'requirements-pendings' }))
  }

  toHome () {
    return this.$router.push(this.localePath({ name: 'index' }))
  }
}
export default Navbar
</script>
