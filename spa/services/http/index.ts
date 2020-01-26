import axios, { AxiosRequestConfig } from 'axios'
import { HOST } from '@/constants'
import getToken from '@/utils/getToken'

const defaults: AxiosRequestConfig = {
  baseURL: HOST,
  timeout: 10000,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
}

const instance = axios.create(defaults)

instance.interceptors.request.use(
  async configs => {
    const token = await getToken()
    if (token) {
      configs.headers.Authorization = `Bearer ${token}`
    }
    return configs
  },
  error => {}
)

instance.interceptors.response.use(
  res => {
    return res.data
  },
  err => {
    if (err.response && err.response.data) {
      const { status, error } = err.response.data
      return Promise.reject({ status, error })
    } else {
      return Promise.reject({ status: -1 })
    }
  }
)

async function request(options: AxiosRequestConfig): Promise<any> {
  const res = await instance.request(options)
  return Promise.resolve(res.data)
}

export default {
  config(options: AxiosRequestConfig) {
    instance.defaults.baseURL = options.baseURL
  },

  post(url: string, options: AxiosRequestConfig = {}) {
    const config = {
      url,
      method: 'post',
      ...options
    } as AxiosRequestConfig
    return request(config)
  },

  get(url: string, options: AxiosRequestConfig = {}): Promise<any> {
    const config = {
      url,
      method: 'get',
      ...options
    } as AxiosRequestConfig
    return request(config)
  },

  delete(url: string, options: AxiosRequestConfig = {}): Promise<any> {
    const config = {
      url,
      method: 'delete',
      ...options
    } as AxiosRequestConfig
    return request(config)
  }
}
