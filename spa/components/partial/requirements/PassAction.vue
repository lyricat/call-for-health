<template>
  <v-dialog v-model="dialog" eager>
    <template #activator="{ on }">
      <v-btn
        v-show="show"
        block
        color="primary"
        depressed
        class="mb-2"
        :loading="loading"
        v-on="on"
      >
        通过审核
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        确认通过审核？
      </v-card-title>
      <v-card-text>
        请确保该需求信息属实
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="dialog = false">
          取消
        </v-btn>
        <v-btn text color="primary" @click="handleReview">
          确认
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { updateRequirementStatus } from '@/services/api'

@Component
class PassAction extends Vue {
  @Prop({ type: Boolean, default: false }) show!: boolean

  @Prop() id

  dialog = false

  loading = false

  async handleReview () {
    this.dialog = false
    this.loading = true
    try {
      await updateRequirementStatus(this.id, { status: 'CONFIRMED' })
      this.$toast({ message: '审核成功', color: 'success' })
      this.$emit('done')
    } catch (error) {
      this.$errorHandler(this.$toast.bind(this), error)
    } finally {
      this.loading = false
    }
  }
}
export default PassAction
</script>
