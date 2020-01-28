<template>
  <div>
    <v-card
      v-for="(item, i) in supplies"
      :key="i"
      class="supplies"
      outlined
    >
      <div class="supplies-content">
        <v-text-field
          v-model="supplies[i].name"
          :rules="rules.productName"
          required
          label="产品名称"
          single-line
        />
        <v-text-field
          v-model="supplies[i].model"
          single-line
          :rules="rules.productModel"
          required
          label="型号或者标准"
        />
        <v-text-field
          v-model="supplies[i].amount"
          single-line
          :rules="rules.productAmount"
          required
          label="需求量"
        />
      </div>
      <v-card-actions>
        <v-btn text color="primary" @click="deleteItem(i)">
          删除
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
  middleware: 'i18n',
  head () {
    return {
      title: this.title
    }
  }
})
class Product extends Vue {
  @Prop() supplies

  rules = {
    productName: [
      v => !!v || '请输入产品名称'
    ],
    productModel: [
      v => !!v || '请输入型号或者标准'
    ],
    productAmount: [
      v => !!v || '请输入需求数量',
      v => /^\d*$/.test(v) || '请输入正确的数字'
    ]
  }

  deleteItem (index) {
    this.$emit('deleteProductItem', index)
  }
}
export default Product
</script>

<style lang="scss" scoped>
.supplies-content{
  padding: 0 16px 0 16px;
  margin: 0 auto;
  box-sizing: border-box;
}
</style>
