<template>
  <div class="product-item d-flex" outlined @click.stop>
    <div class="body-2">
      {{ product.name }}
    </div>
    <div class="body-2 ml-2 model">
      {{ product.model }}
    </div>
    <div v-if="product.amount" class="body-2 grow text-right">
      x{{ product.amount }}
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { IProduct } from '@/services/interface'

@Component
export default class RequirementItem extends Vue {
  @Prop({ type: (Object as () => IProduct), default: null }) readonly product!: Object
}
</script>

<style lang="scss" scoped>
.product-item {
  margin-bottom: 2px;
  .model {
    color: cadetblue;
  }
}
</style>
