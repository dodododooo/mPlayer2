import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import Qs from 'qs'

let $http = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost/dodododooo/mPlayer2/php/' : 'https://dodododooo.com/mplayer2/php/',
  transformRequest: [function (data) {
    return Qs.stringify(data)
  }]
})

Vue.use(Vuex)

const state = new Vuex.Store({
  state: {
    activeTab: 0,
    currentSong: {},
    isUpvote: false,
    currentSongImg: '',
    playList: [],
    upvoteList: [],
    searchList: [],
    showLyric: false,
    showPlayer: false,
    isLoading: false
  },
  mutations: {
    changeTab (state, activeTab) {
      state.activeTab = activeTab
    },
    setList (state, payload) {
      state[payload.list] = payload.data
    },
    searchSong (state, data) {
      state.searchList = data
    },
    playThisSong (state, item) {
      state.currentSong = item
    },
    doUpvote (state, payload) {
      state.isUpvote = payload
    },
    setSongImg (state, img) {
      state.currentSongImg = img
    },
    addSong (state, payload) {
      state[payload.list].push(payload.data)
    },
    removeSong (state, payload) {
      state[payload.list].splice(payload.data, 1)
    },
    showLyric (state, payload) {
      state.showLyric = payload
    },
    showPlayer (state, payload) {
      state.showPlayer = payload
    },
    isLoading (state, payload) {
      state.isLoading = payload
    }
  },
  actions: {
    searchSong (context, payload) {
      context.commit('searchSong', [])
      context.commit('isLoading', true)
      let query = { request: { action: payload.action, data: payload.data, source: payload.source } }
      $http.post('index.php', query).then(response => {
        context.commit('isLoading', false)
        let data = response.data
        context.commit('searchSong', data)
      })
    }
  }
})

export default state
