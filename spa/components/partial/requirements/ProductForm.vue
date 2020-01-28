<template>
  <div>
    <v-card
      v-for="(item, i) in supplies"
      :key="i"
      outlined
      class="pa-3 mb-2"
    >
      <div class="supplies-content">
        <v-textarea
          v-model="supplies[i].name"
          :rules="rules.productName"
          required
          auto-grow
          rows="1"
          label="产品名称"
        />
        <v-textarea
          v-model="supplies[i].model"
          :rules="rules.productModel"
          required
          auto-grow
          rows="1"
          label="型号或者标准"
        />
        <v-text-field
          v-model="supplies[i].amount"
          single-line
          :rules="rules.productAmount"
          label="需求量"
        />
      </div>
      <v-card-actions>
        <v-spacer />
        <v-btn
          small
          outlined
          color="error"
          @click="deleteItem(i)"
        >
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
