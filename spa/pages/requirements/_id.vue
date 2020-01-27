<template>
  <loading :loading="loading" :fullscreen="false">
    <v-container>
      <v-flex>
        <requirement-item
          :requirement="requirement"
          :full="true"
        ></requirement-item>
      </v-flex>
      <v-card outlined v-if="attachments.length !== 0">
        <v-card-text>
          <v-flex class="attachments">
            <div class="overline">附言</div>
            <div
              class="attachment caption"
              v-for="attachment in attachments"
              v-bind:key="attachment.id"
            >
              <span>{{attachment.creator.name}} 附言：</span>
              <span v-if="attachment.type === 'TEXT'">
                {{attachment.data}}
              </span>
              <span v-else>不支持的附件类型</span>
            </div>
          </v-flex>
        </v-card-text>
      </v-card>
    </v-container>
  </loading>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getRequirement, getAttachments } from '@/services/api'
import { IRequirement, IAttachment } from '@/services/interface'
import RequirementItem from '@/components/RequirementItem.vue'

@Component({
  middleware: 'i18n',
  head () {
    return {
      title: this.title
    }
  },
  components: {
    RequirementItem
  }
})
class IndexPage extends Vue {
  requirement: IRequirement | {} = {};
  attachments: Array<IAttachment> | [] = [];

  loading = false

  get title () {
    return '需求详情'
  }

  mounted () {
    this.init()
  }

  async init () {
    this.loading = true
    const id = this.$route.params.id
    await this.request(id)
    this.loading = false
  }

  async request (id) {
    try {
      const requirement = await getRequirement(id)
      this.requirement = requirement
      getAttachments(id).then((attachments) => {
        this.attachments = attachments
      })
    } catch (error) {
      this.$errorHandler(this.$toast.bind(this), error)
    }
  }
}
export default IndexPage
</script>

<style lang="scss" scoped>
.attachments {
  background: rgba(0,0,0,0.01);
}
</style>
