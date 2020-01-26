import 'nuxt-i18n'
import { IError } from '@/utils/errorHandler'

declare module 'vue/types/vue' {
  interface Vue {
    title?: any
    $errorHandler: ($toast: Function, error: IError) => {}
    $toast: (data: { message: string; color: string }) => {}
  }

  interface VueConstructor {
    title?: any
  }
}
