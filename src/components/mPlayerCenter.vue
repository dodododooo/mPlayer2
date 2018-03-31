<template>
  <div class="mplayer-center" v-show="!showLyric">
    <div class="list-bar">
      <span v-show="activeTab === 0">正在播放({{currentSongIndex + '/' + playList.length}})</span>
      <span v-show="activeTab > 0" class="list-bar-icon" v-on:click="playAll"><i class="iconfont icon-mbofang"></i>播放全部</span>
      <span v-show="activeTab < 2" class="list-bar-icon" v-on:click="removeAll"><i class="iconfont icon-empty"></i>清除全部</span>
    </div>
    <div class="list-box" v-bind:style="{transform: 'translateX(' + newLeft + 'px)'}">
      <div
        class="list-box-item"
        v-for="(item, index) in list"
        v-bind:key="index"
        v-bind:class="index === 0 ? 'song' : (index === 1 ? 'upvote' : 'search') + '-list-box'">
        <v-list v-bind:songList="item" v-on:removeListSong="removeSong"></v-list>
        <div class="list-tip" v-show="item.length === 0">{{(activeTab === 2 && isLoading) ? '加载中。。。' : '列表为空'}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import mDB from '../untils/indexedDB'
import { mapState } from 'vuex'
import songList from './songList'
export default {
  name: 'mPlayerCenter',
  components: {
    'v-list': songList
  },
  data () {
    return {
      newScrollTop: 0,
      scrollBarDuration: 2500
    }
  },
  computed: {
    currentSongIndex () {
      let currentIndex = this.playList.indexOf(this.currentSong)
      return currentIndex > -1 ? currentIndex + 1 : 0
    },
    newLeft () {
      return this.activeTab === 2 ? -2040 : (this.activeTab === 1 ? -680 : 0)
    },
    ...mapState({
      activeTab: 'activeTab',
      playList: 'playList',
      upvoteList: 'upvoteList',
      searchList: 'searchList',
      currentSong: 'currentSong',
      showLyric: 'showLyric',
      isLoading: 'isLoading'
    }),
    list () {
      return [this.playList, this.upvoteList, this.searchList]
    }
  },
  mounted () {
    this.setList()
  },
  methods: {
    setList () {
      mDB.getAll('playList', (data) => {
        this.$store.commit('setList', {list: 'playList', data: data})
      })
      mDB.getAll('upvoteList', (data) => {
        this.$store.commit('setList', {list: 'upvoteList', data: data})
      })
    },
    playAll () {
      let list
      if (this.activeTab === 1) {
        list = this.upvoteList
      } else if (this.activeTab === 2) {
        list = this.searchList
      }
      if (list.length === 0) return
      mDB.deleteAll('playList', () => {
        mDB.saveAll('playList', list, (data) => {
          this.$store.commit('setList', {list: 'playList', data: data})
          this.$store.commit('playThisSong', data[0])
        })
      })
    },
    playAllBak () {
      let list
      let firstSong
      if (this.activeTab === 1) {
        list = this.upvoteList
      } else if (this.activeTab === 2) {
        list = this.searchList
      }
      if (list.length === 0) return
      let playList = this.playList
      if (playList.length === 0) {
        list.forEach((item, index) => {
          mDB.save('playList', item, (id) => {
            item.id = id
            this.$store.commit('addSong', {list: 'playList', data: item})
          })
        })
        firstSong = this.playList[0]
      } else {
        let listSongIdArr = this.getAllSongId(list)
        let playListSongIdArr = this.getAllSongId(playList)
        let firstSongIndex = playListSongIdArr.indexOf(listSongIdArr[0])
        if (firstSongIndex > -1) firstSong = this.playList[firstSongIndex]
        listSongIdArr.forEach((item, index) => {
          let t = playListSongIdArr.indexOf(item)
          if (t === -1) {
            let song = list[index]
            mDB.save('playList', song, (id) => {
              song.id = id
              this.$store.commit('addSong', {list: 'playList', data: item})
            })
          }
        })
      }
      this.$store.commit('playThisSong', firstSong)
    },
    getAllSongId (list) {
      let songIdArr = []
      list.forEach((item, index) => {
        songIdArr[index] = item.songId
      })
      return songIdArr
    },
    removeAll () {
      let list
      if (this.activeTab === 0) {
        list = 'playList'
        this.$store.commit('playThisSong', {})
      } else if (this.activeTab === 1) {
        list = 'upvoteList'
      }
      mDB.deleteAll(list, () => {
        this.$store.commit('setList', {list: list, data: []})
      })
    },
    removeSong (item) {
      let song = this.currentSong
      var songIndex, list
      if (this.activeTab === 0) {
        songIndex = this.playList.indexOf(item)
        list = 'playList'
        if (item.songId === song.songId) {
          let totalSong = this.playList.length
          if (totalSong === 1) {
            this.$store.commit('playThisSong', {})
          } else {
            let next = songIndex + 1 > totalSong - 1 ? 0 : songIndex + 1
            this.$store.commit('playThisSong', this.playList[next])
          }
        }
      } else if (this.activeTab === 1) {
        songIndex = this.upvoteList.indexOf(item)
        list = 'upvoteList'
        if (item.songId === song.songId) {
          this.$store.commit('doUpvote', false)
        }
      }
      if (songIndex > -1) {
        mDB.deleteOne(list, item.id, () => {
          this.$store.commit('removeSong', {list: list, data: songIndex})
        })
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mplayer-center {
  position: relative;
  height: 280px;
  width: 680px;
  margin-bottom: 10px;
  overflow: hidden;
}
.list-bar{
  height: 40px;
  line-height: 20px;
  width: 680px;
  padding: 10px 20px;
  font-size: 12px;
  color: #ddd;
}
.list-bar-icon {
  padding: 0 3px;
  cursor: pointer;
}
.list-bar-icon:hover {
  color: #fff;
}
.iconfont {
  font-size: 12px;
}
.list-box {
  position: absolute;
  top: 40px;
  left: 0;
  width: 2040px;
  height: 240px;
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);
  transition-duration: 500ms;
}
.list-box-item {
  position: absolute;
  top: 0;
  left: 0;
  width: 680px;
  height: 240px;
}
.upvote-list-box {
  left: 680px;
}
.search-list-box {
  left: 2040px;
}
.list-tip {
  width: 680px;
  height: 240px;
  padding: 60px 0;
  text-align: center;
  color: #BDBDBD;
}
</style>
