<template>
  <v-card v-if="attachments.length !== 0" outlined>
    <v-card-text>
      <v-flex class="attachments">
        <div class="overline">
          附言
        </div>
        <div
          v-for="attachment in attachments"
          :key="attachment.id"
          class="attachment caption"
        >
          <span>{{ attachment.creator.name }} 附言：</span>
          <span v-if="attachment.type === 'TEXT'">
            {{ attachment.data }}
          </span>
          <span v-else>不支持的附件类型</span>
        </div>
      </v-flex>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { IAttachment } from '@/services/interface'
import { getAttachments } from '@/services/api'

@Component
class AttachmentList extends Vue {
  @Prop() id

  attachments: Array<IAttachment> | [] = []

  mounted () {
    this.requestAttachments()
  }

  refresh () {
    this.requestAttachments()
  }

  async requestAttachments () {
    const attachments = await getAttachments(this.id)
    this.attachments = attachments
  }
}
export default AttachmentList
</script>

<style lang="scss" scoped>
.attachments {
  background: rgba(0,0,0,0.01);
}
</style>
