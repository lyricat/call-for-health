<template>
  <v-flex>
    <template v-if="full">
      <v-card
        v-if="requirement.creator"
        class="requirement-item"
        :ripple="false"
        outlined
      >
        <v-card-text class="pb-1 text">
          <div class="body-2">
            {{ requirement.text }}
          </div>
          <div class="body-2 my-2">
            <div class="requirement-section-title caption mb-1">
              需求货物：
            </div>
            <product-item
              v-for="prod in requirement.products"
              :key="prod.id"
              :product="prod"
            />
          </div>
          <div class="body-2 my-2">
            <div class="requirement-section-title caption mb-1">
              地址：
            </div>
            <copyable-item :destination="requirement.location">
              <span>{{ requirement.location }}</span>
            </copyable-item>
          </div>
          <div class="body-2 my-2">
            <div class="requirement-section-title caption mb-1">
              联系方式：
            </div>
            <copyable-item :destination="requirement.contacts">
              <span v-html="$autolink(requirement.contacts)">{{ requirement.contacts }}</span>
            </copyable-item>
          </div>
        </v-card-text>
        <v-card-actions>
          <div class="caption grow d-flex flex-row mx-2">
            <div class="name grow">
              {{ requirement.creator.name }} 发布
            </div>
            <div class="time">
              {{ $moment(requirement.createdAt).format('YYYY/MM/DD') }}
            </div>
          </div>
        </v-card-actions>
      </v-card>
    </template>
    <template v-else>
      <v-card
        v-if="requirement.creator"
        class="requirement-item"
        :ripple="false"
        outlined
        @click="full ? (()=>{}) : tapRequirement(requirement.id)"
      >
        <v-card-text class="pb-1 text">
          <div class="body-2">
            {{ requirement.text }}
          </div>
          <div class="body-2 my-2">
            需求 {{ requirement.products.length }} 种货物
          </div>
        </v-card-text>
        <v-card-actions>
          <div class="caption grow d-flex flex-row mx-2">
            <div class="name grow">
              {{ requirement.creator.name }} 发布
            </div>
            <div class="time">
              {{ $moment(requirement.createdAt).format('YYYY/MM/DD') }}
            </div>
          </div>
        </v-card-actions>
      </v-card>
    </template>
  </v-flex>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { IRequirement } from '@/services/interface'
import ProductItem from '@/components/ProductItem.vue'
import CopyableItem from '@/components/CopyableItem.vue'

@Component({
  components: {
    ProductItem, CopyableItem
  }
})
export default class RequirementItem extends Vue {
  @Prop({ type: (Object as () => IRequirement), default: null }) readonly requirement!: boolean
  @Prop({ type: Boolean, default: false }) readonly full!: boolean

  tapRequirement (id:any) {
    if (!this.full) {
      this.$router.push('/requirements/' + id)
    }
  }
}
</script>

<style lang="scss" scoped>
.requirement-item {
  margin-bottom: 10px;
  .text {
    color: #000 !important;
  }
  .requirement-section-title {
    border-bottom: 1px solid #ccc;
    color: #666;
  }
}
</style>
