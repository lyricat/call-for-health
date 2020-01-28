<template>
  <div
    v-infinite-scroll="requestRequirements"
    infinite-scroll-disabled="loadMoreDisabled"
    infinite-scroll-distance="10"
  >
    <requirements
      v-for="(requirement, index) in requirements"
      :key="index"
      :requirement="requirement"
      v-bind="$attrs"
    />
    <template v-if="loading">
      <div class="text-center text--secondary pa-5">
        加载中
      </div>
    </template>
    <template v-else-if="requirements.length === 0">
      <div class="text-center text--secondary pa-5">
        没有数据
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import Requirements from './RequirementItem.vue'
import { RequirementStatus, IRequirement } from '@/services/interface'
import { getRequirements } from '@/services/api'

@Component({
  components: {
    Requirements
  }
})
class RequirementList extends Vue {
  @Prop() status!: RequirementStatus

  requirements: IRequirement[] = []

  loading = false

  hasNext = true

  get loadMoreDisabled () {
    return this.loading || !this.hasNext
  }

  async requestRequirements (reload = false) {
    try {
      this.loading = true
      const offset = reload ? 0 : this.requirements.length
      const query = { status: this.status, offset }
      const requirements = await getRequirements(query)
      this.requirements = reload ? requirements : this.requirements.concat(requirements)
      this.hasNext = requirements.length > 0
    } catch (error) {
      this.$errorHandler(this.$toast.bind(this), error)
    } finally {
      this.loading = false
    }
  }
}
export default RequirementList
</script>
