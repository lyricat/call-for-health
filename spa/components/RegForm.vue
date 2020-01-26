<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-text-field v-model="formData.username" :rules="rules.uesername" label="用户名" required />
    <v-text-field v-model="formData.password" :rules="rules.password" label="密码" required />
    <v-btn
      :loading="loading"
      :disabled="!valid"
      color="error"
      rounded
      large
      block
      dark
      @click="login"
    >
      注册
    </v-btn>
  </v-form>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({
  middleware: 'i18n',
  head () {
    return {
      title: this.title
    }
  },
  props: ['formData', 'loading']
})
class RegForm extends Vue {
  valid = true

  rules = {
    uesername: [
      v => !!v || '请输入用户名',
      v => (v && v.length <= 18) || '用户名不能超过18位'
    ],
    password: [
      v => !!v || '请输入密码',
      v => (v && v.length >= 6) || '密码不能少于6位'
    ]
  }

  get usernamePlaceholder () {
    return this.$t('username')
  }

  login () {
    this.$emit('handleSubmit')
  }
}
export default RegForm
</script>

<style lang="scss" scoped>
.requirement-item {
  margin-bottom: 10px;
}
</style>
