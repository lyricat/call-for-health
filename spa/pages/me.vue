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
      <requirement-list :show-status="true" />
    </v-container>
  </loading>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { State } from 'vuex-class'
import { IUser } from '@/services/interface'
import RequirementList from '@/components/partial/requirements/RequirementList.vue'
import KYCStatus from '@/components/partial/me/KYCStatus.vue'

@Component({
  head () {
    return {
      title: this.title
    }
  },
  components: {
    RequirementList,
    'kyc-status': KYCStatus
  }
})
class MePage extends Vue {
  @State(state => state.user.profile) me!: IUser | ''

  loading = false

  get title () {
    return '我的信息'
  }
}
export default MePage
</script>

<style lang="scss" scoped></style>
