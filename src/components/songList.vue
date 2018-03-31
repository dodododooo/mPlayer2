<template>
  <div class="song-list" @wheel.prevent="songListScroll">
    <ul v-bind:style="{transform: 'translateY(' + newScrollTop + 'px)','transition-duration': scrollTopDuration + 'ms'}">
        <li v-for="(item, index) in songList" v-bind:key="index" @click="playThisSong(item, true)" class="list-item" v-bind:class="{'list-item-playing': currentSong.songId === item.songId}">
            <span class="list-info song-index">{{index < 9 ? '0' + (index + 1) : index + 1}}</span>
            <span class="list-info song-speaker"><i class='iconfont icon-mlaba' v-show="currentSong.songId === item.songId"></i></span>
            <span class="list-info song-title">{{item.songTitle}}</span>
            <span class="list-info song-add"><i class='song-add-icon iconfont icon-maddto' v-show="currentSong.songId != item.songId && activeTab > 0" @click.stop="playThisSong(item, false)"></i></span>
            <span class="list-info song-ablum" :title="item.album" @click.stop="handlerSearch(item.album, item.source)">{{item.album}}</span>
            <span class="list-info song-artist" :title="item.artist" @click.stop="handlerSearch(item.artist, item.source)">{{item.artist}}</span>
            <span class="list-info song-delete" @click.stop="removeSong(item)" v-show="activeTab < 2"><i class='song-delete iconfont icon-delete'></i></span>
        </li>
    </ul>
    <div @click.self.prevent="handlerScrollTo" v-show="scrollBarHeight" class="mplayer-scroll">
        <div @mousedown="handlerClickJumpTo" class="scroll-bar" v-bind:style="{top: scrollBarTop + 'px', height: scrollBarHeight + 'px','transition-duration': scrollBarDuration + 'ms'}"></div>
    </div>
  </div>
</template>

<script>
import mDB from '../untils/indexedDB'
export default {
  name: 'songList',
  props: {
    songList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      newScrollTop: 0,
      scrollBarDuration: 2500,
      scrollTopDuration: 2500
    }
  },
  computed: {
    scrollBarHeight () {
      return this.songList.length < 9 ? 0 : 240 * 240 / this.songList.length / 30
    },
    scrollBarTop () {
      return -this.newScrollTop * (240 - this.scrollBarHeight) / (this.songList.length * 30 - 240)
    },
    currentSong () {
      return this.$store.state.currentSong
    },
    playList () {
      return this.$store.state.playList
    },
    activeTab () {
      return this.$store.state.activeTab
    }
  },
  watch: {
    songList: function (newVal, oldVal) {
      this.scrollTopDuration = 0
      if (newVal.length < 9) {
        this.newScrollTop = 0
      } else {
        let tempScrollTop = this.newScrollTop
        this.newScrollTop = tempScrollTop > 0 ? 0 : (tempScrollTop < 240 - newVal.length * 30 ? 240 - newVal.length * 30 : tempScrollTop)
      }
    }
  },
  created () {
    let pl = {}
    pl.addTo = this.addToPlay
    window.pl = pl
  },
  methods: {
    songListScroll (e) {
      if (this.songList.length < 9) return
      let delta = e.wheelDelta || -e.deltaY / 5 * 120
      let handerNewScrollTop = this.newScrollTop + delta
      this.handlerScrollMvoe(handerNewScrollTop)
    },
    handlerScrollMvoe (handerNewScrollTop) {
      this.scrollTopDuration = 2500
      this.newScrollTop = handerNewScrollTop > 0 ? 0 : (handerNewScrollTop < 240 - this.songList.length * 30 ? 240 - this.songList.length * 30 : handerNewScrollTop)
    },
    handlerScrollTo (e) {
      let handerNewScrollTop = -e.offsetY * (this.songList.length * 30 - 240) / (240 - this.scrollBarHeight)
      this.handlerScrollMvoe(handerNewScrollTop)
    },
    handlerClickJumpTo (e) {
      this.scrollBarDuration = 0
      let dragStartY = e.clientY
      let scrollStartTop = parseInt(e.target.style.top)
      document.onmousemove = (e) => {
        e.preventDefault()
        e.stopPropagation()
        let scrollEndTop = scrollStartTop + e.clientY - dragStartY
        let handerNewScrollTop = -(scrollEndTop * (this.songList.length * 30 - 240) / (240 - this.scrollBarHeight))
        this.handlerScrollMvoe(handerNewScrollTop)
      }
      document.onmouseup = () => {
        this.scrollBarDuration = 2500
        document.onmousemove = null
        document.onmouseup = null
      }
    },
    playThisSong (item, isPlayNow) {
      if (item.songId === this.currentSong.songId) return
      if (this.activeTab === 0) {
        this.$store.commit('playThisSong', item)
      } else {
        this.addToPlay(item, isPlayNow)
      }
    },
    addToPlay (item, isPlayNow) {
      if (item.songId === this.currentSong.songId) return
      let songIndex = -1
      let playList = this.playList
      for (let index = 0; index < playList.length; index++) {
        if (playList[index].songId === item.songId) {
          songIndex = index
          break
        }
      }
      if (songIndex > -1) {
        if (isPlayNow) this.$store.commit('playThisSong', playList[songIndex])
      } else {
        mDB.save('playList', item, (id) => {
          item.id = id
          this.$store.commit('addSong', {list: 'playList', data: item})
          if (isPlayNow) this.$store.commit('playThisSong', item)
        })
      }
    },
    handlerSearch (data, source) {
      this.$store.dispatch('searchSong', { action: 'search', data: data, source: source })
      this.$store.commit('changeTab', 2)
    },
    removeSong (item) {
      this.$emit('removeListSong', item)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.song-list {
  position: absolute;
  top: 0;
  left: 0;
  height: 240px;
  width: 680px;
  padding: 0 20px;
  overflow: hidden;
}
.song-list:hover .mplayer-scroll {
  opacity: 1;
}
.song-list ul {
  list-style: none;
  margin: 0;
  padding: 0;
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.22, 0.61, 0.36, 1);
}
.list-item {
  height: 30px;
  width: 640px;
  line-height: 30px;
  font-size: 0;
  color: #ddd;
  border-bottom: 1px solid rgba(95, 95, 95, .1);
  cursor: pointer;
  overflow: hidden;
}
.list-item-playing, .list-item:hover{
  background-color:  rgba(0, 0, 0, .1);
}
.list-item:hover .song-add-icon {
  display: inline;
}
.list-info {
  display: inline-block;
  height: 30px;
  line-height: 30px;
  font-size: 15px;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}
.iconfont {
  font-size: 12px;
}
.song-index {
  width: 30px;
}
.song-speaker {
  width: 20px;
}
.song-title {
  width: 280px;
}
.song-add {
  width: 40px;
  padding: 0 5px 0 10px;
  color: #999;
}
.song-add:hover {
  color: #ccc;
}
.song-add-icon {
  display: none;
  font-size: 16px;
}
.song-ablum {
  width: 170px;
  padding-right: 15px;
}
.song-artist {
  width: 80px;
  padding-right: 5px;
}
.song-delete {
  width: 20px;
  color: #757575;
}
.song-ablum:hover,.song-artist:hover,.song-delete:hover{
  color: #fff;
}
.mplayer-scroll {
  opacity: 0;
  position: absolute;
  height: 240px;
  width: 7px;
  top: 0;
  right: 5px;
  border-radius: 3px;
  background-color:  rgba(0, 0, 0, .1);
  cursor: pointer;
  transition: opacity .5s ease-in-out;
}
.scroll-bar {
  position: absolute;
  width: 7px;
  background-color: rgba(0, 0, 0, .5);
  border-radius: 3px;
  transition-property: top;
  transition-timing-function: cubic-bezier(0.22, 0.61, 0.36, 1);
}
</style>
