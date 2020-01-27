
export default {
  async loadAccountInfo (store) {
    await store.dispatch('user/loadProfile')
  }
}
