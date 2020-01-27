<template>
  <v-app class="app">
    <navbar />
    <v-content>
      <nuxt />
    </v-content>
    <toast />
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Navbar from '@/components/basic/Navbar.vue'
import AccountUtil from '@/utils/account'

@Component({
  middleware: 'i18n',
  components: {
    Navbar
  }
})
class DefaultLayout extends Vue {
  mounted () {
    this.init()
  }

  init () {
    AccountUtil.loadAccountInfo(this.$store)
  }

  goHome () {
    this.$router.replace('/')
  }
}
export default DefaultLayout
</script>
