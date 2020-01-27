import { getMe } from '@/services/api'

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
  }
}
