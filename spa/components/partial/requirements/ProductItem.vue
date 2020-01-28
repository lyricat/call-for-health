<template>
  <div class="product-item d-flex" outlined @click.stop>
    <div class="body-2 name">
      {{ product.name }}
      <div class="model">
        {{ product.model }}
      </div>
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
  padding: 2px 0;
  border-bottom: 1px solid #ddd;
  .name {
    white-space: nowrap;
  }

  .model {
    color: rgb(44, 126, 129);
    font-size: 12px;
    white-space: initial;
  }
}
</style>
