import $t from '@/utils/$t'

export interface IError {
  code?: string | number
  message?: string
  fallback?: string
}

export default ($toast: Function, error: IError) => {
  const fallback = $t('errorcode.fallback')
  let { code = '', message = fallback } = error
  if (code) {
    const key = `errorcode.${code}`
    message = $t(key) === key ? message : `${code}: ${$t(key)}`
  }
  $toast({ message, color: 'error' })
}
