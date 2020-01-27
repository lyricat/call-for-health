import Vue from 'vue'
import Loading from '@/components/basic/Loading.vue'
import VueClipboard from 'vue-clipboard2'

import 'animate.css'

VueClipboard.config.autoSetContainer = true
Vue.use(VueClipboard)

Vue.component('loading', Loading)