<template>
  <loading :loading="loading" :fullscreen="false">
    <v-container>
      <v-flex
        text-left
      >
        <requirement-item
          :requirement="requirement"
          :full="true"
        ></requirement-item>
      </v-flex>
    </v-container>
  </loading>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getRequirement } from '@/services/api'
import { IRequirement } from '@/services/interface'
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
      console.log(requirement)
      this.requirement = requirement
    } catch (error) {
      this.$errorHandler(this.$toast.bind(this), error)
    }
  }
}
export default IndexPage
</script>

<style lang="scss" scoped></style>
