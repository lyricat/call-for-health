<template>
  <v-container fluid class="page-login" pa-4>
    <v-col cols="12">
      <v-tabs
        v-model="tab"
        centered
        hide-slider
        background-color="transparent"
      >
        <v-tab key="login" active-class="title">
          登录
        </v-tab>
        <v-tab key="reg" active-class="title">
          注册
        </v-tab>
      </v-tabs>
    </v-col>
    <v-col cols="12">
      <v-tabs-items v-model="tab" class="tabs-item-section">
        <v-tab-item key="login">
          <login-form
            ref="loginForm"
            :form-data.sync="formData"
            :loading="loading"
            @handleSubmit="handleLogin"
          />
        </v-tab-item>
        <v-tab-item key="reg">
          <reg-form
            ref="regForm"
            :form-data.sync="formData"
            :loading="loading"
            @handleSubmit="handleRegister"
          />
        </v-tab-item>
      </v-tabs-items>
    </v-col>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Action } from 'vuex-class'
import { ILogin } from '@/services/interface'
import LoginForm from '@/components/partial/login/LoginForm.vue'
import RegForm from '@/components/partial/login/RegForm.vue'

@Component({
  head () {
    return {
      title: this.title
    }
  },
  components: {
    LoginForm,
    RegForm
  }
})
class LoginPage extends Vue {
  @Action('user/login') login

  @Action('user/register') register

  loading: boolean = false

  tab: number = 0

  formData: ILogin = {
    username: '',
    password: ''
  }

  get title () {
    return '注册与登录'
  }

  @Watch('tab')
  handleTabChange () {
    this.reset()
  }

  handleLogin () {
    this.submit('LOGIN')
  }

  handleRegister () {
    this.submit('REGISTER')
  }

  reset () {
    const loginForm: any = this.$refs.loginForm
    const regForm: any = this.$refs.regForm
    loginForm && loginForm.reset()
    regForm && regForm.reset()
  }

  async submit (type: string) {
    if (this.loading) { return }
    this.loading = true
    const data: ILogin = {
      username: this.formData.username,
      password: this.formData.password
    }
    try {
      switch (type) {
        case 'LOGIN':
          await this.login(data)
          this.$toast({ message: '登录成功', color: 'success' })
          break
        case 'REGISTER':
          await this.register(data)
          this.$toast({ message: '注册成功', color: 'success' })
          break
      }
      this.$router.push('/me')
    } catch (error) {
      this.$errorHandler(this.$toast.bind(this), error)
    } finally {
      this.loading = false
    }
  }
}
export default LoginPage
</script>

<style lang="scss" scoped>
.page-login {
  .tabs-item-section {
    background-color: transparent;
  }
}
</style>
