import http from '~/services/http'
import { IAuth } from '~/services/interface/login'

export const login = (): Promise<IAuth> => http.post('/login')

export const reg = (): Promise<IAuth> => http.post('/reg')

export const loginTest = (): Promise<IAuth> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        token: '233'
      })
    }, 3000)
  })
}
