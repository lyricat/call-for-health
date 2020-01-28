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

      <h4 class="mb-2 caption text--secondary">
        我发布的需求
      </h4>
      <requirement-item
        v-for="req in requirements"
        :key="req.id"
        :requirement="req"
      />
    </v-container>
  </loading>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { State } from 'vuex-class'
import { IUser, IRequirement } from '@/services/interface'
import { getMyRequirements } from '@/services/api'
import KYCStatus from '@/components/partial/me/KYCStatus.vue'
import RequirementItem from '@/components/partial/requirements/RequirementItem.vue'

@Component({
  head () {
    return {
      title: this.title
    }
  },
  components: {
    'kyc-status': KYCStatus,
    RequirementItem
  }
})
class MePage extends Vue {
  @State(state => state.user.profile) me!: IUser | ''

  requirements: Array<IRequirement> | [] = []

  loading = false

  get title () {
    return '我的信息'
  }

  mounted () {
    this.init()
  }

  async init () {
    this.loading = true
    await this.requestMyRequirements()
    this.loading = false
  }

  async requestMyRequirements () {
    try {
      const requirements = await getMyRequirements()
      this.requirements = requirements
    } catch (error) {
      this.$errorHandler(this.$toast.bind(this), error)
    }
  }
}
export default MePage
</script>

<style lang="scss" scoped></style>
