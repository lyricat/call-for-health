<template>
  <loading :loading="loading" :fullscreen="false">
    <v-container>
      <v-flex class="caption">
        <p>如果您是疫区医院的接口人，可实名注册后发布物资需求。我们的志愿者联系您后会将信息上线。
          请务必确保信息真实有效，所有信息都会数据存证以便有关部门监督。</p>
        <p>如果您可以进行物资供给，请务必联系对方，确保供给信息的正确，避免不必要的浪费。</p>
      </v-flex>
      <v-flex>
        <requirement-item
          v-for="req in requirements"
          :key="req.id"
          :requirement="req"
        />
      </v-flex>
      <template v-if="passedKyc">
        <v-fab-transition>
          <v-btn
            color="primary"
            fab
            fixed
            large
            bottom
            right
            class="v-btn--add-requirement"
            href="#/requirements/add"
          >
            <v-icon>{{ $icons.mdiPlus }}</v-icon>
          </v-btn>
        </v-fab-transition>
      </template>
    </v-container>
  </loading>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
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
  color = ''

  @Getter('user/passedKyc') passedKyc

  mounted () {
    this.init()
  }

  get kycPassed () {
    return false
  }

  async init () {
    this.loading = true
    await this.request()
    this.loading = false
  }

  async request () {
    try {
      const requirements = await getRequirements()
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
