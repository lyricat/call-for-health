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
      <attachment-list :id="id" />
      <actions-sheet>
        <v-card>
          <v-card-text>
            <v-subheader>
              修改
            </v-subheader>
            <attachment-create-action
              :id="id"
              :show="hasPermissionToEdit && confirmed"
              @done="handleRefresh"
            />
            <v-btn
              v-if="hasPermissionToEdit"
              block
              color="primary"
              outlined
              class="mb-2"
              @click="gotoEditReuirement"
            >
              修改内容
            </v-btn>
            <status-update-action
              :id="id"
              :show="hasPermissionToChangeStatus"
              @done="handleRefresh"
            />
            <v-subheader>
              分享
            </v-subheader>
            <share-action />
            <v-btn
              block
              color="primary"
              outlined
              @click="gotoScreenshot"
            >
              保存图片
            </v-btn>
          </v-card-text>
        </v-card>
      </actions-sheet>
    </v-container>
  </loading>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { getRequirement } from '@/services/api'
import { IRequirement } from '@/services/interface'
import RequirementItem from '@/components/partial/requirements/RequirementItem.vue'
import StatusUpdateAction from '@/components/partial/requirements/StatusUpdateAction.vue'
import AttachmentCreateAction from '@/components/partial/requirements/AttachmentCreateAction.vue'
import AttachmentList from '@/components/partial/requirements/AttachmentList.vue'
import ShareAction from '@/components/partial/requirements/ShareAction.vue'

@Component({
  head () {
    return {
      title: this.title
    }
  },
  components: {
    ShareAction,
    AttachmentList,
    RequirementItem,
    StatusUpdateAction,
    AttachmentCreateAction
  }
})
class IndexPage extends Vue {
  @Getter('user/logged') logged

  @Getter('user/isVolunteer') isVolunteer

  requirement: IRequirement | any = {};

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
    } catch (error) {
      this.$errorHandler(this.$toast.bind(this), error)
    }
  }

  gotoScreenshot () {
    this.$router.push(`/requirements/${this.$route.params.id}/screenshot`)
  }

  gotoEditReuirement () {
    this.$router.push(`/requirements/${this.id}/edit`)
  }
}
export default IndexPage
</script>
