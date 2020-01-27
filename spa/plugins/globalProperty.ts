import Vue from 'vue'
import { mdiArrowLeft } from '@mdi/js'
import errorHandler from '@/utils/errorHandler'
import copyUtil from '@/utils/copyUtil'
import autolink from '@/utils/autolink'
import * as moment from 'moment';

export default () => {
  Vue.prototype.$icons = {
    mdiArrowLeft
  }

  Vue.prototype.$toast = function (data: { message: string; color: string }) {
    this.$store.commit('app/toast', data)
  }

  Vue.prototype.$errorHandler = errorHandler

  Vue.prototype.$copyUtil = copyUtil

  Vue.prototype.$moment = moment

  Vue.prototype.$autolink = autolink
}
