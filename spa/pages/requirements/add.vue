<template>
  <loading :loading="loading" :fullscreen="false">
    <v-container class="mb-5">
      <v-form ref="form" v-model="valid" lazy-validation>
        <hosiptal :hosiptal-data.sync="hosiptalData" />
        <v-subheader>物资需求</v-subheader>
        <product :supplies.sync="supplies" @deleteProductItem="deleteItem" />
        <v-btn
          class="mt-4 add-button"
          outlined
          block
          color="primary"
          @click="addItem"
        >
          添加需求
        </v-btn>
        <v-divider class="requirement-divider" />
        <v-btn
          class="mt-5"
          color="primary"
          block
          depressed
          @click="submit"
        >
          保存
        </v-btn>
      </v-form>
    </v-container>
  </loading>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { addRequirements } from '@/services/api'
import { IRequirement } from '@/services/interface'
import Hosiptal from '@/components/partial/requirement/hosiptal.vue'
import Product from '@/components/partial/requirement/product.vue'

@Component({
  middleware: 'i18n',
  head () {
    return {
      title: this.title
    }
  },
  components: {
    Hosiptal,
    Product
  }
})
class AddRequirementPage extends Vue {
  loading = false

  valid = true

  hosiptalData:IRequirement | any = {
    text: '',
    location: '',
    contacts: '',
    sourceUrl: '',
    products: []
  }

  supplies = [{
    name: '',
    model: '',
    amount: null
  }]

  get title () {
    return '新增需求'
  }

  rules = {
    hospitalName: [
      v => !!v || '请输入医院或者医疗机构名称',
      v => (v && v.length >= 3) || '不能少于三个字'
    ],
    hospitalAddress: [
      v => !!v || '请输入地址，用来接收物资',
      v => (v && v.length >= 3) || '不能少于三个字'
    ],
    hospitalCellphone: [
      v => !!v || '请输入联系方式，比如“李萍 18812345678”'
    ],
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

  addItem () {
    this.supplies.push({
      name: '',
      model: '',
      amount: null
    })
  }

  deleteItem (index) {
    const supplies = this.supplies
    if (this.supplies.length <= 1) {
      this.$toast({ message: '最少需要一个物资需求', color: 'error' })
    } else {
      this.supplies = supplies.filter((_, i) => {
        return i !== index
      })
    }
  }

  async submit () {
    const submitData:any = {
      text: this.hosiptalData.text,
      location: this.hosiptalData.location,
      contacts: this.hosiptalData.contacts,
      sourceUrl: this.hosiptalData.sourceUrl,
      products: this.supplies
    }
    const valid = (this.$refs.form as any).validate()
    if (!valid) { return }
    try {
      this.loading = true
      const resp = await addRequirements(submitData)
      this.loading = false
      this.$router.replace('/requirements/' + resp.id)
    } catch (error) {
      this.$toast({ message: error.toString(), color: 'error' })
    }
  }
}
export default AddRequirementPage
</script>

<style lang="scss" scoped>
.information-content{
  padding: 0 16px 0 16px;
  margin: 0 auto;
  box-sizing: border-box;
}
.add-button{
  margin-top: 20px;
}
.requirement-divider{
  margin: 20px auto 20px;
}
</style>
