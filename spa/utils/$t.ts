import Vue from 'vue'
export default (sign: any) => Vue.prototype.$nuxt.$options.i18n.t(sign)
