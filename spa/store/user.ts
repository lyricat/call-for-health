import { getMe, login, register } from '@/services/api'
import setToken from '@/utils/setToken'

export const state = () => ({
  profile: ''
})

export const getters = {
  logged (state) {
    return state.profile
  }
}

export const mutations = {
  setProfile (state, profile) {
    state.profile = profile
  }
}

export const actions = {
  async loadProfile ({ commit }) {
    const profile = await getMe()
    commit('setProfile', profile || '')
  },
  async login ({ commit }, data) {
    const profile = await login(data)
    setToken(profile.access_token)
    commit('setProfile', profile)
  },
  async register ({ commit }, data) {
    const profile = await register(data)
    // TODO: (check) backend should attach token in register response.
    setToken(profile.access_token)
    commit('setProfile', profile)
  }
}
