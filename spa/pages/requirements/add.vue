<template>
  <loading :loading="loading" :fullscreen="false">
    <v-container>
      <v-alert v-model="suppliesItemAlert" class="alert-supplies-item" type="error" dismissible>
        最少需要一个物资需求
      </v-alert>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-subheader>基本信息</v-subheader>
        <div class="information-content">
          <v-text-field v-model="hosiptalData.hospitalName" :rules="rules.hospitalName" required label="医院名称"></v-text-field>
          <v-text-field v-model="hosiptalData.hospitalAddress" :rules="rules.hospitalAddress" required label="医院地址"></v-text-field>
          <v-text-field v-model="hosiptalData.hospitalCellphone" :rules="rules.hospitalCellphone" required label="电话号码"></v-text-field>
        </div>
        <v-subheader>物资需求</v-subheader>
        <v-card
          class="supplies"
          v-for="(item, i) in supplies"
          :key="i"
        >
          <div class="supplies-content">
            <v-text-field v-model="supplies[i].name" :rules="rules.productName" required label="产品名称" single-line></v-text-field>
            <v-text-field v-model="supplies[i].model" single-line :rules="rules.productModel" required label="产品型号"></v-text-field>
            <v-text-field v-model="supplies[i].amount" single-line :rules="rules.productAmount" required label="需求量"></v-text-field>
          </div>
          <v-card-actions>
            <v-btn text @click="delectItem(i)">删除</v-btn>
          </v-card-actions>
        </v-card>

        <v-btn
          class="mr-4 add-button"
          @click="addItem"
        >
          添加需求
        </v-btn>
        <v-divider class="requirement-divider"></v-divider>
        <v-btn
          class="mr-4"
          color="success"
          @click="submit"
        >
          确认
        </v-btn>
      </v-form>
    </v-container>
  </loading>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { add } from '@/services/api/requirement'
import { IRequirement } from '@/services/interface'

@Component({
  middleware: 'i18n',
  head () {
    return {
      title: this.title
    }
  }
})
class IndexPage extends Vue {
  loading = false
  valid = true
  suppliesItemAlert = false

  hosiptalData:IRequirement = {
    hospitalName: '',
    hospitalAddress: '',
    hospitalCellphone: null,
    products: []
  }

  get title () {
    return '新增需求'
  }

  mounted () {
    this.init()
  }

  async init () {
  }

  addItem () {
    this.supplies.push({
      name: '',
      model: '',
      amount: null
    })
  }

  delectItem (index) {
    const supplies = this.supplies
    if (this.supplies.length <= 1) {
      this.suppliesItemAlert = true
    } else {
      this.supplies = supplies.filter((e, i) => {
        console.log(e)
        return i !== index
      })
    }
  }

  async submit () {
    const submitData:IRequirement = {
      text: this.hosiptalData.hospitalName,
      location: this.hosiptalData.hospitalAddress,
      contacts: this.hosiptalData.hospitalCellphone,
      products: this.supplies
    }
    if (this.$refs.form.validate()) {
      try {
        await add(submitData)
      } catch (error) {
      }
    }
  }

  supplies = [{
    name: '',
    model: '',
    amount: null
  }]

  rules = {
    hospitalName: [
      v => !!v || '请输入医院名称',
      v => (v && v.length >= 3) || '不能少于三个字'
    ],
    hospitalAddress: [
      v => !!v || '请输入地址',
      v => (v && v.length >= 3) || '不能少于三个字'
    ],
    hospitalCellphone: [
      v => !!v || '请输入手机号码',
      v => (v && v.length === 11) || '请使用手机号码',
      v => /^1[3456789]\d{9}$/.test(v) || '请输入正确的手机号码'
    ],
    productName: [
      v => !!v || '请输入产品名称'
    ],
    productModel: [
      v => !!v || '请输入产品型号'
    ],
    productAmount: [
      v => !!v || '请输入需求数量',
      v => /^\d*$/.test(v) || '请输入正确的数字'
    ]
  }
}
export default IndexPage
</script>

<style lang="scss" scoped>
.supplies-content,.information-content{
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
.alert-supplies-item{
  width: 90%;
  position: fixed;
  top:150px;
  left:50%;
  transform: translate(-50%,-50%);
  z-index: 1000;
}
</style>
