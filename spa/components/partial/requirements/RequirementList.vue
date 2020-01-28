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
import _ from 'lodash'
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import Requirements from './RequirementItem.vue'
import { RequirementStatus, IRequirement } from '@/services/interface'
import { getRequirements, queryRequirements } from '@/services/api'

@Component({
  components: {
    Requirements
  }
})
class RequirementList extends Vue {
  @Prop() status!: RequirementStatus
  @Prop() keywords!: string

  @Watch('keywords')
  watchKeywords (newVal) {
    if (newVal.trim().length === 0 || newVal.trim().length > 1) {
      this.triggerRequest()
    }
  }

  requirements: IRequirement[] = []

  loading = false

  hasNext = true

  triggerRequest = _.debounce(() => {
    this.requestRequirements(true)
    console.log('request')
  }, 500)

  get loadMoreDisabled () {
    return this.loading || !this.hasNext
  }

  async requestRequirements (reload = false) {
    try {
      this.loading = true
      const offset = reload ? 0 : this.requirements.length
      let requirements
      if (this.keywords.length) {
        const query = { status: this.status, keywords: this.keywords, offset }
        requirements = await queryRequirements(query)
      } else {
        const query = { status: this.status, offset }
        requirements = await getRequirements(query)
      }
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
