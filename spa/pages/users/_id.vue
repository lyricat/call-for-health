<template>
  <loading :loading="loading" :fullscreen="false">
    <v-container v-if="user">
      <h4 class="mb-2 caption text--secondary">
        个人信息
      </h4>
      <p class="body-2">
        用户名：{{ user.name }}
      </p>
      <kyc-status :user="user" />
    </v-container>
  </loading>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getUser } from '@/services/api'
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
  loading = false
  user: IUser | any = {}

  get title () {
    return '用户信息'
  }

  mounted () {
    this.init()
  }

  async init () {
    this.loading = true
    await this.request()
    this.loading = false
  }

  async request () {
    try {
      const id = parseInt(this.$route.params.id)
      console.log(id)
      const user = await getUser(id)
      this.user = user
    } catch (error) {
      console.log(error)
      this.$errorHandler(this.$toast.bind(this), error)
    }
  }
}
export default UserPage
</script>

<style lang="scss" scoped></style>
