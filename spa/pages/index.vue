<template>
  <loading :loading="loading" :fullscreen="false">
    <v-container>
      <v-flex
        text-left
      >
        <requirement-item
          v-for="req in requirements"
          v-bind:key="req.id"
          :requirement="req"
        ></requirement-item>
      </v-flex>
      <v-fab-transition>
        <v-btn
          :color="color"
          fab
          fixed
          large
          bottom
          right
          class="v-btn--add-requirement"
          href="#/requirements/add"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-fab-transition>
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
  color = ''
  icon = ''

  get title () {
    return this.$t('hello')
  }

  mounted () {
    this.init()
  }

  async init () {
    this.loading = true
    await this.request()
    this.loading = false
    this.color = 'red'
    this.icon = 'mdi-plus'
  }

  async request () {
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

<style lang="scss" scoped>
  .v-btn--add-requirement{
    bottom: 0;
    margin: 0 0 16px 16px;
  }
</style>
