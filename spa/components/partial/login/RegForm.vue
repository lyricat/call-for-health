<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-text-field
      v-model="formData.username"
      :rules="rules.uesername"
      label="用户名"
      required
      class="mb-2"
    />
    <v-text-field
      v-model="formData.password"
      :rules="rules.password"
      label="密码"
      required
      type="password"
      class="mb-2"
    />
    <v-text-field
      v-model="passwordConfirm"
      :rules="rules.passwordConfirm"
      required
      label="确认密码"
      type="password"
      class="mb-2"
    />
    <v-btn
      :loading="loading"
      :disabled="!valid"
      depressed
      rounded
      block
      color="primary"
      class="mt-5"
      @click="login"
    >
      注册
    </v-btn>
  </v-form>
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
class RegForm extends Vue {
 @Prop() formData

 @Prop({ type: Boolean, default: false }) loading!: boolean

  valid = true

  passwordConfirm = ''

  get rules () {
    return {
      uesername: [
        v => !!v || '请输入用户名',
        v => (v && v.length <= 18) || '用户名不能超过18位'
      ],
      password: [
        v => !!v || '请输入密码',
        v => (v && v.length >= 6) || '密码不能少于6位'
      ],
      passwordConfirm: [
        v => (v === this.passwordConfirm) || '密码不一致'
      ]
    }
  }

  login () {
    const valid = (this.$refs.form as any).validate()
    if (valid) {
      this.$emit('handleSubmit')
    }
  }

  reset () {
    this.formData.username = ''
    this.formData.password = ''
    this.passwordConfirm = '';
    (this.$refs.form as any).reset()
  }
}
export default RegForm
</script>

<style lang="scss" scoped>
.requirement-item {
  margin-bottom: 10px;
}
</style>
