<template>
  <v-form ref="form">
    <v-textarea
      v-model="bindAttachment.data"
      outlined
      rows="3"
      placeholder="填写附言内容"
      :rules="rules"
    />
  </v-form>
</template>

<script lang="ts">
import { Component, Vue, PropSync } from 'vue-property-decorator'
import { IAttachment } from '@/services/interface'

@Component
class AttachmentForm extends Vue {
  @PropSync('attachment') bindAttachment!: IAttachment

  rules = [v => !!v || '请填写内容']

  validate () {
    const form: any = this.$refs.form
    return form.validate()
  }

  reset () {
    const form: any = this.$refs.form
    form.reset()
  }
}
export default AttachmentForm
</script>
