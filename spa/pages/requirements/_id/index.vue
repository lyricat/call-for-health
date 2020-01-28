<template>
  <loading :loading="loading" :fullscreen="false">
    <v-container>
      <v-flex v-if="notConfirmed" class="hint hint-warning caption">
        <p>本需求尚未得到确认，请等待志愿者确认本需求。</p>
      </v-flex>
      <v-flex>
        <requirement-item
          :requirement="requirement"
          :full="true"
        />
      </v-flex>
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
      <v-flex v-if="confirmed" class="mt-2">
        <v-btn block color="error" depressed class="mb-2" @click="gotoEditReuirement">
          修改
        </v-btn>
        <v-btn block color="primary" depressed class="mb-2" @click="showShare = true">
          分享
        </v-btn>
        <v-btn block color="primary" outlined @click="gotoScreenshot">
          保存图片
        </v-btn>
      </v-flex>
      <div @click="showShare = false">
        <v-overlay
          :value="showShare"
          light
          color="rgba(0,0,0,0.8)"
          opacity="1"
        >
          点击右上角，分享给好友。
        </v-overlay>
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
  requirement: IRequirement | any = {};
  attachments: Array<IAttachment> | [] = [];
  showShare: boolean = false;
  id: any = 0;

  loading = false

  get title () {
    if (this.requirement && this.requirement.text) {
      return this.requirement.text
    }
    return '需求详情'
  }

  get notConfirmed () {
    return this.requirement && this.requirement.status === 'PENDING'
  }

  get confirmed () {
    return this.requirement && this.requirement.status === 'CONFIRMED'
  }

  gotoEditReuirement () {
    this.$router.push('/requirements/edit/' + this.id)
  }

  mounted () {
    this.init()
  }

  async init () {
    this.loading = true
    const id = this.$route.params.id
    this.id = id
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
</style>
