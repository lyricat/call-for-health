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
