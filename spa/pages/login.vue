<template>
  <loading :fullscreen="true">
    <v-container fluid class="page-login" pa-4>
      <v-col cols="12">
        <v-tabs v-model="tab" background-color="transparent" grow dark>
          <v-tab key="login">
            登录
          </v-tab>
          <v-tab key="reg">
            注册
          </v-tab>
        </v-tabs>
      </v-col>
      <v-col cols="12">
        <v-tabs-items v-model="tab" class="tabs-item-section" dark>
          <v-tab-item key="login">
            <!-- {{ formData.username }} -->
            <LoginForm :form-data.sync="formData" :loading="loading" @handleSubmit="login" />
          </v-tab-item>
          <v-tab-item key="reg">
            <RegForm :form-data.sync="formData" :loading="loading" @handleSubmit="reg" />
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-container>
  </loading>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { login, reg } from '@/services/api/login'
import { ILogin } from '@/services/interface/login'
import LoginForm from '@/components/LoginForm.vue'
import RegForm from '@/components/RegForm.vue'
import setToken from '@/utils/setToken'

@Component({
  middleware: 'i18n',
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
    return this.$t('hello')
  }

  mounted () {
    // this.init()
  }

  async submit (type: string) {
    if (this.lock) {
      return
    }

    // 开启 Loading 和 Lock 状态
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
      console.log('login/reg res:', res)

      // 保存 token 到 localStorage
      await setToken(res.data.access_token)

      // 取消 Loading 和 Lock 状态
      this.loading = false
      this.lock = false

      // 跳转到列表界面
      this.$router.push('/')
    } catch (error) {
      // 取消 Loading 和 Lock 状态
      this.loading = false
      this.lock = false
      this.$errorHandler(this.$toast.bind(this), error)
    }
  }

  async login () {
    await this.submit('login')
  }

  async reg () {
    await this.submit('reg')
  }
}
export default LoginPage
</script>

<style lang="scss" scoped>
.page-login {
  background-color: #3c3f46;
  // height: 100vh;
  min-height: 100%;
  .tabs-item-section {
    background-color: transparent;
  }
}
</style>
