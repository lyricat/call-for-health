import { getMe, login, register } from '@/services/api'
import setToken from '@/utils/setToken'

export const state = () => ({
  profile: ''
})

export const getters = {
  logged (state) {
    return state.profile
  },
  passedKyc (state) {
    if (state && state.profile) {
      return state.profile.kycState === 1
    }
    return false
  },
  isVolunteer (state) {
    if (state && state.profile) {
      return state.profile.role === 'VOLUNTEER'
    }
    return false
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
    commit('setProfile', profile)
  },
  async login ({ commit }, data) {
    const profile = await login(data)
    setToken(profile.access_token)
    commit('setProfile', profile)
  },
  logout ({ commit }) {
    commit('setProfile', '')
    setToken('')
  },
  async register ({ commit }, data) {
    const profile = await register(data)
    setToken(profile.access_token)
    commit('setProfile', profile)
  }
}
