<template>
  <v-dialog v-model="dialog" max-width="290">
    <template #activator="{ on }">
      <v-btn
        v-show="show"
        outlined
        block
        depressed
        color="primary"
        class="mb-2"
        :loading="loading"
        v-on="on"
      >
        设置状态
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        设置需求状态
      </v-card-title>
      <v-card-text>
        <v-btn
          block
          color="primary"
          outlined
          class="mb-2"
          @click="confirmRequirement"
        >
          确认
        </v-btn>
        <v-btn
          block
          color="primary"
          outlined
          class="mb-2"
          @click="holdRequirement"
        >
          待确认
        </v-btn>
        <v-btn
          block
          color="primary"
          outlined
          class="mb-2"
          @click="hideRequirement"
        >
          隐藏
        </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { updateRequirementStatus } from '@/services/api'

@Component
class StatusAction extends Vue {
  @Prop({ type: Boolean, default: false }) show!: boolean

  @Prop() id

  dialog = false

  loading = false

  async confirmRequirement () {
    await this.changeRequirementStatus('CONFIRMED')
  }

  async holdRequirement () {
    await this.changeRequirementStatus('PENDING')
  }

  async hideRequirement () {
    await this.changeRequirementStatus('HIDDEN')
  }

  async changeRequirementStatus (st) {
    try {
      this.loading = true
      await updateRequirementStatus(this.id, {
        'status': st
      })
      this.$emit('done')
      this.dialog = false
      this.$toast({ message: '操作成功', color: 'success' })
    } catch (error) {
      this.$errorHandler(this.$toast.bind(this), error)
    } finally {
      this.loading = false
    }
  }
}
export default StatusAction
</script>
