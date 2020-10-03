export const state = () => ({
  error: null
})

export const mutations = {
  setError (state, error) {
    state.error = error
  },
  clearError (state) {
    state.error = null
  }
}
// Display this error for some users
export const getters = {
  error: state => state.error
}
