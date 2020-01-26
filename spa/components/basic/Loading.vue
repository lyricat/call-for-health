<template>
  <div class="loading" :class="{ 'full-screen': fullscreen }" @click.stop>
    <div v-show="loading" class="loading-wrap" @click.stop>
      <div v-show="spinner" class="loading-spinner">
        <v-progress-circular :width="3" color="white" indeterminate />
      </div>
      <transition name="fade" :duration="200">
        <div v-if="loading" class="loading-hint">
          <slot name="hint">
            <span v-show="hint" class="hint">{{ hint }}</span>
          </slot>
        </div>
      </transition>
    </div>
    <div class="loading-content" @click.stop>
      <template v-if="!hideWhenLoading || !loading">
        <slot />
      </template>
    </div>
    <transition name="fade">
      <div v-show="mask && loading" class="loading-mask" />
    </transition>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class Loading extends Vue {
  @Prop({ type: Boolean, default: true }) readonly fullscreen!: boolean

  @Prop({ type: Boolean, default: false }) readonly loading!: boolean

  @Prop({ type: String, default: '' }) readonly hint!: string

  @Prop({ type: Boolean, default: false }) readonly mask!: boolean

  @Prop({ type: Boolean, default: true }) readonly spinner!: boolean

  @Prop({ type: Boolean, default: true }) readonly hideWhenLoading!: boolean
}
</script>

<style lang="scss" scoped>
.loading {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 200px;
  transition: all 0.3s ease;
  min-height: 240px;
  z-index: 1000;

  &.full-screen {
    position: fixed;
    top: 0;
    left: 0;
  }

  .loading-wrap {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-self: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 20px;
    z-index: 1002;

    .loading-spinner {
      z-index: 1004;
      padding: 10px;
      box-sizing: content-box;
      border-radius: 5px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .loading-hint {
      color: #dddddd;
      font-size: 12px;
    }
  }

  .loading-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
  }

  .loading-content {
    height: 100%;
    z-index: 1001;
  }
}
</style>
