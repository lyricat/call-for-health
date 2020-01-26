<template>
  <div class="product-item d-flex" outlined @click.stop>
    <div class="body-2">{{ product.name }}</div>
    <div class="body-2 ml-2">{{ product.model }}</div>
    <div class="body-2 grow text-right" v-if="product.amount !== -1">x{{ product.amount }}</div>
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
.requirement-item {
  margin-bottom: 10px;
}
</style>
