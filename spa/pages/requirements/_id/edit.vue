<template>
  <loading :loading="loading" :fullscreen="false">
    <v-container class="py-5">
      <v-form ref="form" v-model="valid" lazy-validation>
        <hosiptal-form :hosiptal-data.sync="hosiptalData" />
        <v-subheader class="pa-0">
          物资需求
        </v-subheader>
        <product-form :supplies.sync="supplies" @deleteProductItem="deleteItem" />
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
          修改
        </v-btn>
      </v-form>
    </v-container>
  </loading>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { editRequirements, getRequirement } from '@/services/api'
import { IRequirement, IAttachment } from '@/services/interface'
import HosiptalForm from '@/components/partial/requirements/HosiptalForm.vue'
import ProductForm from '@/components/partial/requirements/ProductForm.vue'

@Component({
  middleware: 'i18n',
  head () {
    return {
      title: this.title
    }
  },
  components: {
    HosiptalForm,
    ProductForm
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
        const resp = await editRequirements(this.requirement.id, submitData)
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
