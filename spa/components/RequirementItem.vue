<template>
  <v-card v-if="requirement.creator" class="requirement-item" outlined @click.stop="tapRequirement(requirement.id)">
    <v-card-text class="pb-1 text">
      <div class="body-2">{{ requirement.text }}</div>
      <template v-if="full">
        <div class="body-2 my-2">
          <div class="requirement-section-title caption mb-1">需求货物：</div>
          <product-item
            v-for="prod in requirement.products"
            v-bind:key="prod.id"
            :product="prod"
          ></product-item>
        </div>
        <div class="body-2 my-2">
          <div class="requirement-section-title caption mb-1">地址：</div>
          <div class="">{{ requirement.location }}</div>
        </div>
        <div class="body-2 my-2">
          <div class="requirement-section-title caption mb-1">联系方式：</div>
          <div class="">{{ requirement.contacts }}</div>
        </div>
      </template>
      <template v-else>
        <div class="body-2 mt-2">
          需求 {{ requirement.products.length }} 种货物
        </div>
      </template>
    </v-card-text>
    <v-card-actions>
      <div class="caption grow d-flex flex-row mx-2">
        <div class="name grow">{{ requirement.creator.name }} 发布</div>
        <div class="time">{{ $moment(requirement.createdAt).format('YYYY/MM/DD') }}</div>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { IRequirement } from '@/services/interface'
import ProductItem from '@/components/ProductItem.vue'

@Component({
  components: {
    ProductItem
  }
})
export default class RequirementItem extends Vue {
  @Prop({ type: (Object as () => IRequirement), default: null }) readonly requirement!: boolean
  @Prop({ type: Boolean, default: false }) readonly full!: boolean

  tapRequirement (id:any) {
    this.$router.push('/requirements/' + id)
  }
}
</script>

<style lang="scss" scoped>
.requirement-item {
  margin-bottom: 10px;
  .text {
    color: #000;
  }
  .requirement-section-title {
    border-bottom: 1px solid #ccc;
    color: #666;
  }
}
</style>
