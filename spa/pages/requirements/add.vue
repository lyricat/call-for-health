<template>
  <loading :loading="loading" :fullscreen="false">
    <v-container>
      <v-form ref="form" v-model="valid" lazy-validation>
        <div class="information-content">
          <v-text-field
            v-model="hosiptalData.text"
            required
            label="医院名称"
            dense
            :rules="rules.text"
          />
          <v-text-field
            v-model="hosiptalData.location"
            :rules="rules.location"
            required
            dense
            label="医院地址，用于收取物资"
          />
          <v-text-field
            v-model="hosiptalData.contacts"
            :rules="rules.contacts"
            required
            dense
            label="联系方式"
          />
          <v-text-field
            v-model="hosiptalData.sourceUrl"
            :rules="rules.sourceUrl"
            dense
            label="信息来源网址，如果没有，请留空"
          />
        </div>
        <v-subheader>物资需求</v-subheader>
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
              dense
              single-line
            />
            <v-text-field
              v-model="supplies[i].model"
              single-line
              :rules="rules.productModel"
              required
              dense
              label="型号或者标准"
            />
            <v-text-field
              v-model="supplies[i].amount"
              single-line
              :rules="rules.productAmount"
              required
              dense
              label="需求量"
            />
          </div>
          <v-card-actions>
            <v-btn text color="primary" @click="delectItem(i)">
              删除
            </v-btn>
          </v-card-actions>
        </v-card>

        <v-btn
          class="mr-4 add-button"
          outlined
          block
          color="primary"
          @click="addItem"
        >
          添加需求
        </v-btn>
        <v-divider class="requirement-divider" />
        <v-btn
          class="mr-4"
          color="primary"
          block
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
    // console.log(submitData)
    // if (this.$refs.form.validate()) {
    try {
      this.loading = true
      const resp = await add(submitData)
      this.loading = false
      this.$router.replace('/requirements/' + resp.id)
    } catch (error) {
      this.$toast({ message: error.toString(), color: 'error' })
    }
    // }
  }

  supplies = [{
    name: '',
    model: '',
    amount: null
  }]

  rules = {
    text: [
      v => !!v || '请输入医院或者医疗机构名称',
      v => (v && v.length >= 3) || '不能少于三个字'
    ],
    location: [
      v => !!v || '请输入地址，用来接收物资',
      v => (v && v.length >= 3) || '不能少于三个字'
    ],
    contacts: [
      v => !!v || '请输入联系方式，比如“李萍 18812345678”'
    ],
    sourceUrl: [
      v => !!v || '这个信息的来源网址，如果没有，请留空'
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
}
export default AddRequirementPage
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
  top:50px;
  left:50%;
  transform: translate(-50%,-50%);
  z-index: 1000;
}
</style>
