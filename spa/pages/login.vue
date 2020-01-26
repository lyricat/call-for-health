<template>
  <loading :loading="loading" :fullscreen="false">
    <v-container>
      <v-flex
        text-left
      >
        <v-btn 为></v-btn>
      </v-flex>
    </v-container>
  </loading>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getRequirements } from '@/services/api'
import { IRequirement } from '@/services/interface'
import RequirementItem from '@/components/RequirementItem.vue'

@Component({
  middleware: 'i18n',
  head () {
    return {
      title: this.title
    }
  },
  components: {
    RequirementItem
  }
})
class IndexPage extends Vue {
  requirements: Array<IRequirement> | [] = [];

  loading = false

  get title () {
    return this.$t('hello')
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
      const requirements = await getRequirements()
      console.log(requirements)
      this.requirements = requirements
    } catch (error) {
      this.$errorHandler(this.$toast.bind(this), error)
    }
  }
}
export default IndexPage
</script>

<style lang="scss" scoped></style>
