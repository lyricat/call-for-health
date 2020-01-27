<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-text-field
      v-model="formData.username"
      :rules="rules.uesername"
      required
      label="用户名"
      class="mb-2"
    />
    <v-text-field
      v-model="formData.password"
      :rules="rules.password"
      required
      type="password"
      label="密码"
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
      登录
    </v-btn>
  </v-form>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
  head () {
    return {
      title: this.title
    }
  }
})
class LoginForm extends Vue {
  @Prop() formData

  @Prop({ type: Boolean, default: false }) loading!: boolean

  valid = true

  rules = {
    uesername: [
      v => !!v || '请输入用户名',
      v => (v && v.length <= 18) || '用户名不能超过18位'
    ],
    password: [
      v => !!v || '请输入密码'
    ]
  }

  login () {
    const valid = (this.$refs.form as any).validate()
    if (valid) { this.$emit('handleSubmit') }
  }

  reset () {
    this.formData.username = ''
    this.formData.password = '';
    (this.$refs.form as any).reset()
  }
}
export default LoginForm
</script>

<style lang="scss" scoped>
.requirement-item {
  margin-bottom: 10px;
}
</style>
