import Vue from 'vue'
import Loading from '@/components/basic/Loading.vue'
import QRCode from '@/components/basic/QRCode.vue'
import VueClipboard from 'vue-clipboard2'

import 'animate.css'

VueClipboard.config.autoSetContainer = true
Vue.use(VueClipboard)

Vue.component('qr-code', QRCode)
Vue.component('loading', Loading)