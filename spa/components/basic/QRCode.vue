<template>
  <div>
    <v-alert v-if="error" :value="true" color="error" icon="error" class="ma-5" />
    <canvas v-else ref="canvas" class="canvas" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import QRCode from 'qrcode'

@Component
class VQRCode extends Vue {
  @Prop({ type: String, default: '' }) readonly value!: string

  error = false

  dataUrl = null

  get size () {
    return process.browser && document.body.clientWidth < 625 ? 96 : 128
  }

  @Watch('value')
  draw () {
    const canvas = this.$refs.canvas
    QRCode.toCanvas(
      canvas,
      this.value,
      {
        width: this.size,
        margin: 0
      },
      (err, _) => {
        if (err) {
          this.error = true
        }
      }
    )
  }

  mounted () {
    this.draw()
  }
}
export default VQRCode
</script>

<style lang="scss" scoped>
.canvas {
  border-radius: 5px;
}
</style>
