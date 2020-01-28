<template>
  <v-bottom-sheet v-model="dialog">
    <template #activator="{ on }">
      <v-btn
        v-show="show"
        block
        depressed
        color="primary"
        class="mb-2"
        :disabled="loading"
        v-on="on"
      >
        添加附言
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        添加附言
      </v-card-title>
      <v-card-text class="pb-0">
        <attachment-form ref="form" :attachment.sync="attachment" />
      </v-card-text>
      <v-card-actions class="px-5">
        <v-spacer />
        <v-btn
          text
          color="primary"
          @click="dialog = false"
        >
          取消
        </v-btn>
        <v-btn
          depressed
          color="primary"
          :loading="loading"
          @click="handleCreate"
        >
          添加
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-bottom-sheet>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import AttachmentForm from './AttachmentForm.vue'
import { IAttachment } from '@/services/interface'
import { addAttachments } from '@/services/api'

@Component({
  components: {
    AttachmentForm
  }
})
class AttachmentCreateAction extends Vue {
  @Prop() id

  @Prop({ type: Boolean, default: false }) show!: boolean

  dialog = false

  loading = false

  attachment: IAttachment = { data: '' }

  @Watch('dialog')
  handleDialogChange () {
    this.attachment = { data: '' }
    const form: any = this.$refs.form
    form && form.reset()
  }

  async handleCreate () {
    const valid = (this.$refs.form as any).validate()
    if (!valid) { return }
    this.loading = true
    await this.requsetAddAttachments()
    this.loading = false
  }

  async requsetAddAttachments () {
    try {
      const data = this.attachment
      await addAttachments(this.id, data)
      this.$emit('done')
      this.dialog = false
    } catch (error) {
      this.$errorHandler(this.$toast.bind(this), error)
    }
  }
}
export default AttachmentCreateAction
</script>
