import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    hasLogin: false,
    questions: [],
    questionsByUser: [],
    answersByUser: []
  },
  mutations: {
    changeLogin(state, val) {
      state.hasLogin = val
    },
    getQuestions(state, val) {
      state.questions = val
    },
    questionsByUser(state, val) {
      state.questionsByUser = val
    },
    answersByUser(state, val) {
      state.answersByUser = val
    },
    addQuestions(state, val) {
      state.questions.unshift(val)
      state.questionsByUser.unshift(val)
    },
    deleteQuestions(state, val) {
      state.questionsByUser.splice(val, 1)    
    }
  },
  actions: {
    getQuestions({ commit }) {
      axios
        .get('http://localhost:3000/questions/')
        .then((result) => {
          commit('getQuestions', result.data.result)
        }).catch((err) => {
        });
    },
    questionsByUser({ commit }) {
      const token = localStorage.getItem('Token')
      const userId = localStorage.getItem('userId')
      axios.
        get(`http://localhost:3000/users/${userId}`, {
          headers: {
            token
          }
        })
        .then((result) => {
          commit('questionsByUser', result.data.user.questions)
          commit('answersByUser', result.data.user.answers)
        }).catch((err) => {
          console.log('err :', err.response.data);
        });
    }
  }
})
