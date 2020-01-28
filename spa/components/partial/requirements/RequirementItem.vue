<template>
  <v-flex>
    <template v-if="full">
      <v-card
        v-if="requirement.creator"
        class="requirement-item"
        :ripple="false"
        outlined
      >
        <v-card-text class="text">
          <div class="card-top body-2">
            <div>
              <span class="status" :class="statusClass(requirement)">
                {{ statusText(requirement) }}
              </span>
              {{ requirement.text }}
            </div>
          </div>
          <div class="requirement-section-title caption mb-1">
            需求货物：
          </div>
          <div class="requirement-section-body body-2 my-2">
            <product-item
              v-for="prod in requirement.products"
              :key="prod.id"
              :product="prod"
            />
          </div>
          <div class="requirement-section-title caption mb-1">
            地址：
          </div>
          <div class="requirement-section-body body-2 my-2">
            <copyable-item :destination="requirement.location">
              <span>{{ requirement.location }}</span>
            </copyable-item>
          </div>
          <div class="requirement-section-title caption mb-1">
            联系方式：
          </div>
          <div class="requirement-section-body body-2 my-2">
            <copyable-item :destination="requirement.contacts">
              <span v-html="$autolink(requirement.contacts)">{{ requirement.contacts }}</span>
            </copyable-item>
          </div>
        </v-card-text>
        <v-card-actions class="meta">
          <div class="caption grow d-flex flex-row">
            <div class="name grow">
              <template v-if="requirement.sourceUrl">
                <a :href="requirement.sourceUrl" target="_blank">来源</a> ·
              </template>
              由 {{ requirement.creator.name }} 发布
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
        <v-card-text class="text">
          <div class="card-top pb-0 body-2">
            <span class="status" :class="statusClass(requirement)">
              {{ statusText(requirement) }}
            </span>
            {{ requirement.text }}
          </div>
          <div class="requirement-section-body body-2 my-2">
            {{ `急需${requirement.products.length}种物资，约${productSum}件`}}
          </div>
        </v-card-text>
        <v-card-actions class="meta">
          <div class="caption grow d-flex flex-row">
            <div class="name grow">
              <template v-if="requirement.sourceUrl">
                <a :href="requirement.sourceUrl" target="_blank">来源</a> ·
              </template>
              由 {{ requirement.creator.name }} 发布
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
import ProductItem from './ProductItem.vue'
import { IRequirement } from '@/services/interface'
import CopyableItem from '@/components/CopyableItem.vue'

@Component({
  components: {
    ProductItem, CopyableItem
  }
})
export default class RequirementItem extends Vue {
  @Prop({ type: (Object as () => IRequirement) }) requirement!: IRequirement

  @Prop({ type: Boolean, default: false }) full!: boolean

  @Prop({ type: Boolean, default: false }) showStatus!: boolean

  get productSum () {
    let sum = 0
    for (let ix = 0; ix < this.requirement.products.length; ix++) {
      const amount = parseInt(this.requirement.products[ix].amount) || 0
      if (amount > 0) {
        sum += amount
      }
    }
    return sum
  }

  tapRequirement (id:any) {
    if (!this.full) {
      this.$router.push('/requirements/' + id)
    }
  }

  statusText (req) {
    if (req.status === 'PENDING') {
      return '等待审核'
    } else if (req.status === 'CONFIRMED' && req.sourceUrl && req.sourceUrl.indexOf('http') === 0) {
      return '信息属实'
    } else if (req.status === 'CONFIRMED') {
      return '审核中'
    }
    return ''
  }

  statusClass (req) {
    if (req.status === 'PENDING') {
      return 'pending'
    } else if (req.status === 'CONFIRMED' && req.sourceUrl && req.sourceUrl.indexOf('http') === 0) {
      return 'confirmed'
    } else if (req.status === 'CONFIRMED') {
      return 'need_ref'
    }
    return ''
  }
}
</script>

<style lang="scss" scoped>
.requirement-item {
  margin-bottom: 10px;
  .card-top {
    padding: 10px 10px;
  }
  .text {
    color: #000 !important;
    padding: 0;
  }
  .requirement-section-body {
    padding: 0 10px;
  }
  .requirement-section-title {
    background: rgba(0, 0, 0, 0.05);
    padding: 2px 10px;
  }
  .meta {
    background: rgba(0, 0, 0, 0.05);
    padding: 4px 10px;
  }
  .status {
    border-radius: 2px;
    background: #ccc;
    font-size: 12px;
    padding: 2px 3px;
    margin-right: 0.5em;
    text-align: center;
    font-weight: bold;
    &.confirmed {
      background: rgb(22, 168, 22);
      color: white;
    }
    &.need_ref {
      background: rgb(219, 130, 27);
      color: white;
    }
  }
}
</style>
