<template>
  <loading :loading="loading" :fullscreen="false">
    <v-container>
      <v-flex>
        <requirement-item
          :requirement="requirement"
          :full="true"
        />
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
      <v-flex class="mt-2">
        <v-btn block color="primary" depressed class="mb-2" @click="showShare = true">分享</v-btn>
        <v-btn block color="primary" outlined @click="gotoScreenshot">保存图片</v-btn>
      </v-flex>
      <div v-if="showShare" class="share-mask" @click="showShare = false">
        <div class="share-text">
          点击右上角，分享给好友。
        </div>
      </div>
    </v-container>
  </loading>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getRequirement, getAttachments } from '@/services/api'
import { IRequirement, IAttachment } from '@/services/interface'
import RequirementItem from '@/components/RequirementItem.vue'

@Component({
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
  showShare: boolean = false;

  loading = false

  get title () {
    if (this.requirement && this.requirement.text) {
      return this.requirement.text
    }
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

  gotoScreenshot () {
    this.$router.push(`/requirements/${this.$route.params.id}/screenshot`)
  }
}
export default IndexPage
</script>

<style lang="scss" scoped>
.attachments {
  background: rgba(0,0,0,0.01);
}
.share-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.8);
  .share-text {
    position: fixed;
    top: 20%;
    left: 0;
    right: 0;
    bottom: 0;
    text-align: center;
    color: white;
    font-weight: bold;
  }
}
</style>
