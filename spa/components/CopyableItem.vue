<template>
  <div class="d-flex flex-row align-center">
    <div class="d-flex align-center" style="height: 28px;">
      <slot />
    </div>
    <v-btn
      v-clipboard:copy="destination"
      v-clipboard:success="() => $copyUtil.onCopy(this)"
      v-clipboard:error="() => $copyUtil.onError(this)"
      small
      depressed
      text
      color="primary"
    >
      复制
    </v-btn>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class CopyableItem extends Vue {
  @Prop({ type: String, default: null }) readonly destination!: string
}
</script>

<style lang="scss" scoped>
</style>
