import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import {AuthenticationDetails, CognitoUserPool, CognitoUser} from 'amazon-cognito-identity-js'

Vue.use(Vuex)

var cognitoUser

export default new Vuex.Store({
  state: {
    status: '',
    token: '',
    personID: localStorage.getItem('personID') || '',
    churchCode: localStorage.getItem('churchCode') || '',
    churchProfile: 'http://static1.squarespace.com/static/563fb2d1e4b07f78f2db4c32/t/5c3621a9352f53339f36df51/1552577214769/?format=1500w'
  },
  mutations: {
    auth_request (state) {
      state.status = 'loading'
    },
    auth_success (state, payload) {
      state.status = 'success'
      state.token = payload.token
      state.personID = 1
      // state.personID = payload.personID
      state.churchCode = payload.churchCode
    },
    auth_error (state) {
      state.status = 'error'
    },
    logout (state) {
      state.status = ''
      state.token = ''
    }
  },
  actions: {
    login ({commit}, user) {
      return new Promise((resolve, reject) => {
        const { username, password } = user
        var authenticationData = {
          Username: username,
          Password: password
        }
        var authenticationDetails = new AuthenticationDetails(authenticationData)
        var poolData = {
          UserPoolId: 'us-east-2_th6kgbG7W',
          ClientId: '40ljk2uqsfr2rhuqascb564rlq'
        }
        var userPool = new CognitoUserPool(poolData)
        var userData = {
          Username: username,
          Pool: userPool
        }
        cognitoUser = new CognitoUser(userData)
        cognitoUser.authenticateUser(authenticationDetails, {
          onSuccess: function (result) {
            // Local Storage
            console.log(result)
            var idToken = result.getIdToken().getJwtToken()
            var personID = result.getIdToken().payload.person_id
            var churchCode = result.getIdToken().payload.churchUsername

            // Set Header
            axios.defaults.headers.common['Authorization'] = `Bearer ${idToken}`

            // Change State
            commit('auth_success', {
              token: idToken,
              personID: personID,
              churchCode: churchCode
            })
            resolve()
          },
          onFailure: function (err) {
            commit('auth_error')
            reject(err)
          }
        })
      })
    },
    checkLogin ({commit}) {
      return new Promise((resolve, reject) => {
        var data = {
          UserPoolId: 'us-east-2_th6kgbG7W',
          ClientId: '40ljk2uqsfr2rhuqascb564rlq'
        }
        var userPool = new CognitoUserPool(data)
        cognitoUser = userPool.getCurrentUser()

        if (cognitoUser != null) {
          cognitoUser.getSession(function (err, session) {
            if (err) {
              reject(err)
            }

            console.log(session)

            var idToken = session.getIdToken().getJwtToken()
            var personID = session.getIdToken().payload.person_id
            var churchCode = session.getIdToken().payload.churchUsername

            console.log(churchCode)

            commit('auth_success', {
              token: idToken,
              personID: personID,
              churchCode: churchCode
            })
            resolve()
          })
        }
      })
    },
    logout ({commit}) {
      return new Promise((resolve, reject) => {
        commit('logout')
        cognitoUser.deleteUser(function (err, result) {
          if (err) {
            reject(err)
          }
        })
        delete axios.defaults.headers.common['Authorization']
        resolve()
      })
    }
  },
  getters: {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
    personID: state => state.personID,
    churchCode: state => state.churchCode
  }
})
