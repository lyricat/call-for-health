import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'
import infiniteScroll from 'vue-infinite-scroll'
import Loading from '@/components/basic/Loading.vue'
import QRCode from '@/components/basic/QRCode.vue'
import LoginRequire from '@/components/basic/LoginRequire.vue'
import Toast from '@/components/basic/Toast.vue'

import 'animate.css'

VueClipboard.config.autoSetContainer = true
Vue.use(VueClipboard)
Vue.use(infiniteScroll)

Vue.component('qr-code', QRCode)
Vue.component('loading', Loading)
Vue.component('loading', Loading)
Vue.component('login-require', LoginRequire)
Vue.component('toast', Toast)
