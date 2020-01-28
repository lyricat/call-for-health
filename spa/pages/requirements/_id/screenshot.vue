
<template>
  <loading :loading="loading" :fullscreen="false">
    <v-container>
      <v-flex>
        <requirement-item
          :requirement="requirement"
          :full="true"
        />
      </v-flex>
      <v-card outlined>
        <v-card-text class="d-flex flex-row">
          <v-flex class="body-2">
            请截图保存到相册。<br>
            扫码查看最新的需求情况。
          </v-flex>
          <qr-code :value="qrcodeUrl" />
        </v-card-text>
      </v-card>
    </v-container>
  </loading>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getRequirement } from '@/services/api'
import { IRequirement } from '@/services/interface'
import RequirementItem from '@/components/partial/requirements/RequirementItem.vue'
import { WEB_HOST } from '@/constants'

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
  requirementId: string = ''

  loading = false

  get title () {
    return '需求详情'
  }

  get qrcodeUrl () {
    return `${WEB_HOST}/#/requirements/${this.requirementId}`
  }

  mounted () {
    this.init()
  }

  async init () {
    this.loading = true
    const id = this.$route.params.id
    this.requirementId = id
    await this.request(id)
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
}
export default IndexPage
</script>

<style lang="scss" scoped>
</style>
