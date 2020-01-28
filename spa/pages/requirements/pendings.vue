<template>
  <v-container>
    <p>待审核列表</p>
    <v-flex class="mb-4">
      <v-text-field v-model="keywords" placeholder="搜索关键字" hide-details single-line></v-text-field>
    </v-flex>
    <requirement-list status="PENDING" :keywords="keywords" show-status />
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import RequirementList from '@/components/partial/requirements/RequirementList.vue'
import RequirementItem from '@/components/partial/requirements/RequirementItem.vue'
import { IRequirement } from '@/services/interface'

@Component({
  components: {
    RequirementList,
    RequirementItem
  }
})
class PendingRequirements extends Vue {
  checkingItem: IRequirement | null = null

  keywords = ''

  dialog = false
}
export default PendingRequirements
</script>
