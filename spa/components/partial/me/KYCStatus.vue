<template>
  <div class="mb-5">
    <div class="d-flex align-center">
      <div class="flex-fill">
        <h4 class="mb-2 caption text--secondary">
          实名信息
        </h4>
        <div class="body-2 mb-1">
          实名状态：{{ me.kycState === 0 ? '还没有实名' : '已经实名' }}
        </div>
        <template v-if="passed">
          <div class="body-2 mb-1">
            姓名：{{ kyc.realName }}
          </div>
          <div class="body-2 mb-1">
            身份证号：{{ kyc.realId }}
          </div>
        </template>
        <div v-else class="body-2 mb-1">
          认证消息：<span class="warning--text">{{ kyc.errorMessage || kyc.resultMessage }}</span>
        </div>
      </div>
      <v-btn
        v-if="me.kycState === 0"
        text
        :loading="loading"
        color="primary"
        @click="handleStartKYC"
      >
        去实名
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { IUser } from '@/services/interface'
import { getKYCLink } from '@/services/api'

@Component
class KYCStatus extends Vue {
  @Prop() me!: IUser

  loading = false

  get kyc () {
    return this.me.kyc
  }

  get passed () {
    return this.kyc &&
    this.me.kycState === 1 &&
    (this.kyc.resultCode === 1000 || this.kyc.resultCode === 1001)
  }

  async handleStartKYC () {
    this.loading = true
    try {
      const res = await getKYCLink()
      window.location.href = res.url
    } catch (error) {
      this.$errorHandler(this.$toast.bind(this), error)
    } finally {
      this.loading = false
    }
  }
}
export default KYCStatus
</script>
