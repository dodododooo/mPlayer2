<template>
 <div>
  <div class="mplayer-lrcs" v-show="showLyric">
    <ul class="lyric-rows" v-bind:style="{transform: 'translateY(' + (-lrcIndex * 25) + 'px)'}">
      <li class="lyric-row" v-for="i in 4" v-bind:key="i"></li>
      <li class="lyric-row" v-for="(row, index) in lyric" v-bind:key="index" v-bind:class="{'active-lyric': lyricKeys[lrcIndex] === index}">{{row}}</li>
    </ul>
  </div>
  <div class="mplayer-bottom" @mousewheel.stop.prevent="well">
    <div class="bottom-list">
        <img class="song-img" v-bind:src="currentSongImg" height="50" width="50">
    </div>
    <div class="bottom-list song-info">
      <div class="song-title"><span>{{currentSong.songTitle}}</span><span v-show="!currentSong.songId"><a class="mplayer-link" href="http://dodododooo.com" target="blank">mPlayer</a></span></div>
      <div class="song-artist"><span>{{currentSong.artist}}</span><span v-show="!currentSong.songId"><a class="mplayer-link" href="http://dodododooo.com" target="blank">dodododooo</a></span></div>
      <i class="upvote-icon iconfont"
        v-on:click="doUpvote"
        v-bind:class="'icon-' + (isUpvote ? 'loved' : 'love')"></i>
      <div class="song-time">
        <span>{{currentTime}}</span>
        <div class="seek-bar" v-on:click.self="seekClickTo">
          <div class="seek-time" v-on:click.self="seekClickTo" v-bind:style="{width: progress + '%'}">
            <div class="seek-dot" v-on:mousedown="seekMoveTo"></div>
          </div>
        </div>
        <span>{{duration}}</span>
      </div>
    </div>
    <div class="bottom-list bottom-btn">
      <i class="play-icon iconfont"
        v-on:click="changeMode"
        v-bind:class="'icon-' + (playMode === 1 ? 'danqu' : (playMode === 2 ? 'xunhuan' : 'random'))"></i>
      <i class="play-icon iconfont icon-prev" v-on:click="playCtrl(0)"></i>
      <i class="play-icon iconfont"
        v-on:click="doPause"
        v-bind:class="'icon-' + (isPlaying ? 'pause' : 'play')"></i>
      <i class="play-icon iconfont icon-next" v-on:click="playCtrl(1)"></i>
      <i class="play-icon iconfont icon-geci" v-on:click="openLyric"></i>
    </div>
  </div>
 </div>
</template>

<script>
import mDB from '../untils/indexedDB'
import { mapState } from 'vuex'
export default {
  name: 'mPlayerBottom',
  data () {
    let audio = new Audio()
    return {
      audio: audio,
      lyric: [],
      lrcIndex: 0,
      isPlaying: false,
      currentTime: '00:00',
      duration: '00:00',
      progress: 0,
      playMode: 2, // 播放模式：1，单曲循环；2，列表循环；3，随机播放
      isSeek: false
    }
  },
  computed: {
    lyricKeys () {
      return Object.keys(this.lyric)
    },
    ...mapState({
      currentSong: 'currentSong',
      playList: 'playList',
      upvoteList: 'upvoteList',
      isUpvote: 'isUpvote',
      showLyric: 'showLyric',
      currentSongImg (state) {
        return state.currentSongImg || require('../assets/logo.jpg')
      }
    })
  },
  watch: {
    currentSong: function (newVal) {
      this.lrcIndex = 0
      if (!newVal.songId) {
        this.reset()
      } else {
        if (this.upvoteList.some(item => (item.songId === newVal.songId))) {
          this.$store.commit('doUpvote', true)
        } else {
          this.$store.commit('doUpvote', false)
        }
        this.doPlay()
      }
    }
  },
  created () {
    this.audio.autoplay = true
    this.audio.onplay = () => {
      this.isPlaying = true
    }
    this.audio.onloadedmetadata = () => {
      this.duration = this.secondsToMinutes(this.audio.duration)
    }
    this.audio.onended = () => {
      this.isPlaying = false
      this.playCtrl(1)
    }
    this.audio.onpause = () => {
      this.isPlaying = false
    }
    this.audio.onerror = () => {
      this.isPlaying = false
      this.playCtrl(1)
    }
    this.audio.ontimeupdate = () => {
      let nowTime = this.audio.currentTime
      this.currentTime = this.secondsToMinutes(nowTime)
      if (this.isSeek) return
      this.progress = 100 * nowTime / this.audio.duration
      if (this.showLyric && this.lyric.length === 0) {
        this.lrcIndex = this.scrollLyric(nowTime)
      }
    }
  },
  methods: {
    doPlay () {
      let query = {request: {action: 'songInfo', data: this.currentSong, source: this.currentSong.source}}
      this.$axios.post('index.php', query).then(response => {
        let data = response.data
        this.loadImg(data.songImg)
        this.lyric = data.lyric
        this.audio.src = data.songUrl
      })
    },
    playCtrl (direction) {
      let song = this.currentSong
      let totalSong = this.playList.length
      let currentIndex = this.playList.indexOf(song)
      if (totalSong > 0) {
        if (!song.songId) return this.$store.commit('playThisSong', this.playList[0])
        let ctrlIndex
        if (this.playMode < 3) {
          ctrlIndex = direction === 0 ? (currentIndex - 1 < 0 ? totalSong - 1 : currentIndex - 1) : (currentIndex + 1 > totalSong - 1 ? 0 : currentIndex + 1)
        } else {
          ctrlIndex = Math.floor(Math.random() * totalSong)
        }
        this.$store.commit('playThisSong', this.playList[ctrlIndex])
      } else {
        this.reset()
      }
    },
    doPause () {
      let song = this.currentSong
      if (!song.songId) return this.playCtrl(1)
      this.isPlaying ? this.audio.pause() : this.audio.play()
    },
    openLyric () {
      this.$store.commit('showLyric', this.showLyric === false)
    },
    changeMode () {
      this.playMode += 1
      this.playMode > 3 ? (this.playMode = 1) && (this.audio.loop = true) : this.audio.loop = false
    },
    doUpvote () {
      let song = this.currentSong
      if (!song.songId) return
      if (this.isUpvote) {
        let index = this.upvoteList.indexOf(song)
        mDB.deleteOne('upvoteList', song.id, () => {
          this.$store.commit('removeSong', {list: 'upvoteList', data: index})
          this.$store.commit('doUpvote', false)
        })
      } else {
        mDB.save('upvoteList', song, (id) => {
          song.id = id
          this.$store.commit('addSong', {list: 'upvoteList', data: song})
          this.$store.commit('doUpvote', true)
        })
      }
    },
    seekClickTo (e) {
      let song = this.currentSong
      if (!song.songId) return false
      let seekEndWidth = e.offsetX / 3
      this.seekTo(seekEndWidth)
    },
    seekMoveTo (e) {
      let song = this.currentSong
      if (!song.songId) return false
      this.isSeek = true
      let seekStartX = e.clientX
      let seekStartWidth = this.progress * 3
      let seekEndWidth
      document.onmousemove = (e) => {
        e.preventDefault()
        e.stopPropagation()
        seekEndWidth = (seekStartWidth + e.clientX - seekStartX) / 3
        this.progress = seekEndWidth
      }
      document.onmouseup = () => {
        if (seekEndWidth) this.seekTo(seekEndWidth)
        this.isSeek = false
        document.onmousemove = null
        document.onmouseup = null
      }
    },
    seekTo (seekEndWidth) {
      let progress = seekEndWidth < 0 ? 0 : (seekEndWidth > 100 ? 100 : seekEndWidth)
      this.audio.currentTime = parseInt(progress * this.audio.duration / 100)
    },
    loadImg (imgUrl) {
      let newImg = new Image()
      newImg.onload = () => {
        this.$store.commit('setSongImg', imgUrl)
      }
      newImg.onerror = () => {
        this.$store.commit('setSongImg', require('../assets/logo.jpg'))
      }
      newImg.src = imgUrl
    },
    scrollLyric (time) {
      let t = parseInt(time * 1000 + 300)
      let keys = this.lyricKeys
      for (let i = keys.length - 1; i >= 0; i--) {
        if (t >= keys[i]) {
          return i
        }
      }
      // return 0
    },
    secondsToMinutes: (seconds) => {
      let MM = Math.floor(seconds / 60)
      let SS = Math.floor(seconds % 60)
      MM = MM < 10 ? (MM = '0' + MM) : MM
      SS = SS < 10 ? (SS = '0' + SS) : SS
      let time = MM + ':' + SS
      return time
    },
    reset () {
      this.currentTime = '00:00'
      this.duration = '00:00'
      this.isPlaying = false
      this.$store.commit('doUpvote', false)
      this.progress = 0
      this.lyric = ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mplayer-lrcs {
  position: absolute;
  top: 60px;
  left: 0;
  width: 680px;
  height: 250px;
  padding: 0 20px;
  overflow: hidden;
}
.lyric-rows {
  list-style: none;
  margin: 0;
  padding: 0;
  transition-property: all;
  transition-duration: 500ms;
  transition-timing-function: ease-out;
}
.lyric-row {
  height: 25px;
  line-height: 25px;
  width: 640px;
  padding: 0 20px;
  color: #aaa;
  font-size: 14px;
  text-align: center;
}
.active-lyric {
  color: #ddd;
  font-size: 17px
}
.mplayer-bottom {
  position: absolute;
  left: 0;
  bottom: 0;
  height: 50px;
  width: 680px;
  padding: 0 20px;
  background-color: rgba(0, 0, 0, .3)
}
.bottom-list {
    display: inline-block;
    height: 50px;
    font-size: 0;
    vertical-align: top;
}
.bottom-list img {
  width: 50px;
  height: 50px;
}
.song-info {
    position: relative;
    height: 50px;
    width: 380px;
    margin: 0 10px;
}
.song-title {
    height: 18px;
    width: 340px;
    line-height: 18px;
    font-size: 13px;
    color: #ddd;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
}
.song-artist {
    height: 15px;
    width: 340px;
    line-height: 15px;
    font-size: 12px;
    color: #aaa;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
}
.mplayer-link {
  text-decoration:none;
  color: inherit;
}
.upvote-icon {
    position: absolute;
    top: 7px;
    right: 12px;
    font-size: 17px;
    color: #ccc;
    cursor: pointer;
}
.icon-loved {
  color: #f00;
}
.song-time {
    height: 17px;
    line-height: 17px;
    font-size: 12px;
    color: #aaa;
}
.seek-bar {
    display: inline-block;
    height: 2px;
    width: 300px;
    margin: 0 3px 3px 3px;
    background-color: #757575;
    cursor: pointer;
}
.seek-time {
    position: relative;
    height: 2px;
    background-color: #f00;
}
.seek-dot {
    position: absolute;
    right: -3px;
    top: -2px;
    height: 6px;
    width: 6px;
    border-radius: 2px;
    background-color: #f00;
    cursor: pointer;
}
.bottom-btn {
  font-size: 0;
}
.play-icon {
    display: inline-block;
    height: 50px;
    line-height: 50px;
    width: 36px;
    text-align: center;
    color: #ccc;
    font-size: 18px;
    cursor: pointer;
    vertical-align: top;
}
.play-icon:hover {
    color: #fff;
}
.icon-play,.icon-pause {
    font-size: 28px;
}
</style>
