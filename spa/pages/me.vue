<template>
  <loading :loading="loading" :fullscreen="false">
    <v-container v-if="me">
      <v-flex
        text-left
      >
        {{ me.name }}
      </v-flex>
    </v-container>
  </loading>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getMe } from '@/services/api'
import { IUser } from '@/services/interface'

@Component({
  middleware: 'i18n',
  head () {
    return {
      title: this.title
    }
  }
})
class MePage extends Vue {
  me: IUser = null;

  loading = false

  get title () {
    return '我'
  }

  mounted () {
    this.init()
  }

  async init () {
    this.loading = true
    await this.requesUser()
    this.loading = false
  }

  async requesUser () {
    try {
      const me = await getMe()
      this.me = me
    } catch (error) {
      this.$errorHandler(this.$toast.bind(this), error)
    }
  }
}
export default MePage
</script>

<style lang="scss" scoped></style>
