<template>
  <loading :loading="loading" :fullscreen="false">
    <v-container v-if="me">
      <h4 class="mb-2 caption text--secondary">
        个人信息
      </h4>
      <p class="body-2">
        用户名：{{ me.name }}
      </p>
      <kyc-status :me="me" />
    </v-container>
  </loading>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { State } from 'vuex-class'
import { IUser } from '@/services/interface'
import KYCStatus from '@/components/partial/me/KYCStatus.vue'

@Component({
  head () {
    return {
      title: this.title
    }
  },
  components: {
    'kyc-status': KYCStatus
  }
})
class UserPage extends Vue {
  @State(state => state.user.profile) me!: IUser | ''

  loading = false

  get title () {
    return '用户信息'
  }

  mounted () {
    this.init()
  }

  init () {
    this.loading = true
    this.loading = false
  }
}
export default UserPage
</script>

<style lang="scss" scoped></style>
