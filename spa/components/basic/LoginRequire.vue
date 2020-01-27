<template>
  <div class="login-require">
    <template v-if="logged">
      <slot name="action-me" :on="{click: toProfile}">
        <v-btn text color="primary">
          我的
        </v-btn>
      </slot>
    </template>
    <template v-else>
      <slot name="action-login" :on="{click: toLogin}">
        <v-btn text color="primary">
          登录
        </v-btn>
      </slot>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'

@Component
class LoginRequire extends Vue {
  @Getter('user/logged') logged

  toLogin () {
    this.$router.push(this.localePath({ name: 'login' }))
  }

  toProfile () {
    this.$router.push(this.localePath({ name: 'me' }))
  }
}
export default LoginRequire
</script>
