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
  components: {
    RequirementItem
  }
})
class IndexPage extends Vue {
  requirements: Array<IRequirement> | [] = [];

  loading = false

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
