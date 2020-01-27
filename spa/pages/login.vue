<template>
  <v-container fluid class="page-login" pa-4>
    <v-col cols="12">
      <v-tabs v-model="tab" background-color="transparent" grow>
        <v-tab key="login">
          登录
        </v-tab>
        <v-tab key="reg">
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
            @handleSubmit="login"
          />
        </v-tab-item>
        <v-tab-item key="reg">
          <reg-form
            ref="regForm"
            :form-data.sync="formData"
            :loading="loading"
            @handleSubmit="reg"
          />
        </v-tab-item>
      </v-tabs-items>
    </v-col>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { login, reg } from '@/services/api/login'
import { ILogin } from '@/services/interface/login'
import LoginForm from '@/components/partial/login/LoginForm.vue'
import RegForm from '@/components/partial/login/RegForm.vue'
import setToken from '@/utils/setToken'

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
  lock: boolean = false

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

  login () {
    this.submit('login')
  }

  reg () {
    this.submit('reg')
  }

  reset () {
    const loginForm: any = this.$refs.loginForm
    const regForm: any = this.$refs.regForm
    loginForm && loginForm.reset()
    regForm && regForm.reset()
  }

  async submit (type: string) {
    if (this.lock) { return }
    this.loading = true
    this.lock = true
    const submitData: ILogin = {
      username: this.formData.username,
      password: this.formData.password
    }
    try {
      let res: any
      if (type === 'login') {
        res = await login(submitData)
      } else {
        res = await reg(submitData)
      }
      // TODO: backend should attach token in register response.
      setToken(res.access_token)
      this.$router.push('/me')
    } catch (error) {
      this.$errorHandler(this.$toast.bind(this), error)
    } finally {
      this.loading = false
      this.lock = false
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
