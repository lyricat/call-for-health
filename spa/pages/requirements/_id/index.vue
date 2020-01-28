<template>
  <loading :loading="loading" :fullscreen="false">
    <v-container>
      <v-flex v-if="notConfirmed" class="hint hint-warning caption">
        <p>本需求尚未得到确认</p>
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
      <!-- <pass-action :id="id" :show="showReview" @done="handleRefresh" /> -->
      <v-flex v-if="confirmed" class="mt-2">
        <v-btn
          block
          color="primary"
          depressed
          class="mb-2"
          @click="showShare = true"
        >
          分享
        </v-btn>
        <v-btn
          block
          color="primary"
          outlined
          @click="gotoScreenshot"
        >
          保存图片
        </v-btn>
      </v-flex>
      <v-flex class="mt-4">
        <v-btn
          v-if="hasPermissionToEdit"
          block
          color="primary"
          outlined
          class="mb-2"
          @click="gotoEditReuirement"
        >
          修改需求内容
        </v-btn>
        <v-btn
          v-if="hasPermissionToChangeStatus"
          block
          color="primary"
          outlined
          class="mb-2"
          @click="showStatusDialog = true"
        >
          设置状态
        </v-btn>
        <v-dialog
          v-model="showStatusDialog"
          max-width="290"
        >
          <v-card>
            <v-card-title class="headline">
              设置需求状态
            </v-card-title>
            <v-card-text>
              <v-btn block color="primary" outlined class="mb-2" @click="confirmRequirement">
                确认
              </v-btn>
              <v-btn block color="primary" outlined class="mb-2" @click="holdRequirement">
                待确认
              </v-btn>
              <v-btn block color="primary" outlined class="mb-2" @click="hideRequirement">
                隐藏
              </v-btn>
            </v-card-text>
          </v-card>
        </v-dialog>
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
import { Getter } from 'vuex-class'
import { getRequirement, getAttachments, updateRequirementStatus } from '@/services/api'
import { IRequirement, IAttachment } from '@/services/interface'
import RequirementItem from '@/components/partial/requirements/RequirementItem.vue'
import PassAction from '@/components/partial/requirements/PassAction.vue'

@Component({
  head () {
    return {
      title: this.title
    }
  },
  components: {
    RequirementItem,
    PassAction
  }
})
class IndexPage extends Vue {
  @Getter('user/logged') logged

  @Getter('user/isVolunteer') isVolunteer

  requirement: IRequirement | any = {};

  attachments: Array<IAttachment> | [] = [];

  showShare: boolean = false;

  showStatusDialog: boolean = false;

  loading = false

  get title () {
    if (this.requirement && this.requirement.text) {
      return this.requirement.text
    }
    return '需求详情'
  }

  get id () {
    return this.$route.params.id
  }

  get notConfirmed () {
    return this.requirement && this.requirement.status === 'PENDING'
  }

  get confirmed () {
    return this.requirement && this.requirement.status === 'CONFIRMED'
  }

  get hasPermissionToEdit () {
    return this.requirement.creatorId === this.logged.id || this.isVolunteer
  }

  get hasPermissionToChangeStatus () {
    return this.isVolunteer
  }

  gotoEditReuirement () {
    this.$router.push(`/requirements/${this.id}/edit`)
  }

  mounted () {
    this.init()
  }

  handleRefresh () {
    this.init()
  }

  async init () {
    this.loading = true
    await this.request(this.id)
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
    const requirement = await updateRequirementStatus(this.requirement.id, {
      'status': st
    })
    this.requirement = requirement
    this.showStatusDialog = false
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
