import People from '@/services/people';

export const PeopleModule = {
  namespaced: true,
  state: {
    people: [],
    loading: true
  },
  mutations: {
    setPeople (state, payload) { state.people = payload.people; },
    setLoading (state, loading) { state.loading = loading; },
  },
  actions: {
    async getPeople ({state, commit}, getCurrentStateIfAlreadyThere=false) {
      if(getCurrentStateIfAlreadyThere && state.people.length !== 0) { return state.people; }
      commit('setLoading', true);
      const getPeopleRes = await People.getPeople();
      commit('setPeople', { people: getPeopleRes.data.people });
      commit('setLoading', false);
    }
  }
}