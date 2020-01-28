<template>
  <v-dialog v-model="dialog" fullscreen>
    <template #activator="{ on }">
      <v-btn
        block
        depressed
        color="primary"
        class="mb-2"
        v-on="on"
      >
        分享
      </v-btn>
    </template>
    <div class="text" @click="dialog = false">
      点击右上角，分享给好友。
    </div>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
class ShareAction extends Vue {
  dialog = false
}
export default ShareAction
</script>
<style lang="scss" scoped>
.text {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
