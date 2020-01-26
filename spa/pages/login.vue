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
import { loginTest, reg } from '@/services/api/login'
import { IRequirement } from '@/services/interface'
import RequirementItem from '@/components/RequirementItem.vue'
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
    RequirementItem,
    LoginForm,
    RegForm
  }
})
class LoginPage extends Vue {
  requirements: Array<IRequirement> | [] = []

  loading = false
  tab = 0
  formData = {
    username: '',
    password: ''
  }

  get title () {
    return this.$t('hello')
  }

  mounted () {
    // this.init()
  }

  async login () {
    console.log('Enter login', this.formData)
    // 开启 Loading 状态
    this.loading = true

    const loginData = {
      username: this.formData.username,
      password: this.formData.password
    }

    try {
      const res = await loginTest(loginData)
      await setToken(res.token)

      // 取消 Loading 状态
      this.loading = false
      console.log('login res:', res)

      // 将 Token 存在本地
    } catch (error) {
      this.$errorHandler(this.$toast.bind(this), error)
    }
  }

  async reg () {
    console.log('Enter login', this.formData)

    try {
      const res = await reg()
      console.log(res)
      // 将 Token 存在本地
    } catch (error) {
      this.$errorHandler(this.$toast.bind(this), error)
    }
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
