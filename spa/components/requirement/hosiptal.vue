<template>
  <div class="information-content">
    <v-text-field
      v-model="hosiptalData.hospitalName"
      required
      label="医院名称"
      :rules="rules.hospitalName"
    />
    <v-text-field
      v-model="hosiptalData.hospitalAddress"
      :rules="rules.hospitalAddress"
      required
      label="医院地址"
    />
    <v-text-field
      v-model="hosiptalData.hospitalCellphone"
      :rules="rules.hospitalCellphone"
      required
      label="联系方式"
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
    ]
  }
}
export default Hosiptal
</script>

<style lang="scss" scoped></style>
