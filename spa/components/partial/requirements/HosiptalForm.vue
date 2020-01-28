<template>
  <div class="information-content">
    <v-text-field
      v-model="hosiptalData.text"
      required
      label="医院名称"
      dense
      :rules="rules.text"
      class="mb-4"
    />
    <v-text-field
      v-model="hosiptalData.location"
      :rules="rules.location"
      required
      dense
      label="医院地址，用于收取物资"
      class="mb-4"
    />
    <v-text-field
      v-model="hosiptalData.contacts"
      :rules="rules.contacts"
      required
      dense
      label="联系方式"
      class="mb-4"
    />
    <v-text-field
      v-model="hosiptalData.sourceUrl"
      :rules="rules.sourceUrl"
      dense
      label="信息来源网址，如果没有，请留空"
    />
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
class Hosiptal extends Vue {
  @Prop() hosiptalData

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
    ]
  }
}
export default Hosiptal
</script>
