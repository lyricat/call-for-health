import Vue from 'vue'
import {
  mdiArrowLeft,
  mdiDotsVertical,
  mdiPlus,
  mdiPencil,
  mdiMenu
} from '@mdi/js'
import moment from 'moment'
import { UTC_OFFSET } from '@/constants'
import errorHandler from '@/utils/errorHandler'
import copyUtil from '@/utils/copyUtil'
import autolink from '@/utils/autolink'

export default () => {
  Vue.prototype.$icons = {
    mdiArrowLeft,
    mdiDotsVertical,
    mdiPencil,
    mdiPlus,
    mdiMenu
  }

  Vue.prototype.$toast = function (data: { message: string; color: string }) {
    this.$store.commit('app/toast', data)
  }

  Vue.prototype.$errorHandler = errorHandler

  Vue.prototype.$copyUtil = copyUtil

  Vue.prototype.$moment = (x) => {
    return moment(x).utcOffset(UTC_OFFSET)
  }

  Vue.prototype.$autolink = autolink
}
