<template>
  <loading :loading="loading" :fullscreen="false">
    <v-container>
      <v-form ref="form" v-model="valid" lazy-validation>
        <hosiptal :hosiptal-data.sync="hosiptalData" />
        <v-subheader>物资需求</v-subheader>
        <product :supplies.sync="supplies" @deleteProductItem="deleteItem" />
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
          修改
        </v-btn>
      </v-form>
    </v-container>
  </loading>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { edit } from '@/services/api/requirement'
import { getRequirement } from '@/services/api'
import { IRequirement, IAttachment } from '@/services/interface'
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
class EditRequirementPage extends Vue {
  requirement: IRequirement | any = {};
  attachments: Array<IAttachment> | [] = [];
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
    if (this.hosiptalData && this.hosiptalData.text) {
      return '编辑 ' + this.hosiptalData.text
    }
    return '编辑需求'
  }

  mounted () {
    this.init()
  }

  async init () {
    this.loading = true
    const id = this.$route.params.id
    await this.request(id)
    this.loading = false
  }

  async request (id) {
    try {
      const requirement = await getRequirement(id)
      this.requirement = requirement
      this.hosiptalData = {
        text: requirement.text,
        location: requirement.location,
        contacts: requirement.contacts,
        sourceUrl: requirement.sourceUrl
      }
      this.supplies = requirement.products
    } catch (error) {
      this.$errorHandler(this.$toast.bind(this), error)
    }
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
    if ((this.$refs.form as any).validate()) {
      try {
        this.loading = true
        const resp = await edit(this.requirement.id, submitData)
        this.loading = false
        this.$router.replace('/requirements/' + resp.id)
      } catch (error) {
        this.$toast({ message: error.toString(), color: 'error' })
      }
    }
  }
}
export default EditRequirementPage
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
