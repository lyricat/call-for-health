<template>
  <v-container>
    <p>待审核列表</p>
    <requirement-list status="PENDING" show-status />
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

  dialog = false
}
export default PendingRequirements
</script>
