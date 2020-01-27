<template>
  <loading :loading="loading" :fullscreen="false">
    <v-container>
      <v-text-field :rules="rules" label="医院名称"></v-text-field>
      <v-text-field :rules="rules" label="医院地址"></v-text-field>
      <v-text-field :rules="rules" label="联系方式"></v-text-field>
      <v-subheader>物资需求</v-subheader>
      <v-divider></v-divider>
      <v-text-field :rules="rules" label="产品名称"></v-text-field>
      <v-text-field :rules="rules" label="产品型号"></v-text-field>
      <v-text-field :rules="rules" label="需求量"></v-text-field>
      <v-fab-transition>
        <v-btn
          color="red"
          dark
          absolute
          bottom
          fab
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-fab-transition>
    </v-container>
  </loading>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
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
  requirement: IRequirement | {} = {};

  loading = false

  get title () {
    return '新增需求'
  }

  mounted () {
    this.init()
  }

  async init () {
  }
}
export default IndexPage
</script>

<style lang="scss" scoped></style>
