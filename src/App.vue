<template>
  <div id="mplayer">
    <transition name="fade">
      <div id="show-mplayer" v-show="!showPlayer" v-on:click="openPlayer">
        <div class="show-player-bar" v-bind:style="{'background-image': 'url('+ currentSongImg +')'}"></div>
      </div>
    </transition>
    <div id="mplayer-box" v-bind:style="{transform: 'translateX(' + (showPlayer ? 0 : -900) + 'px)', opacity: (showPlayer ? 1 : 0)}"  @click.right.prevent="showInfo">
      <div class="mplayer-cover" v-bind:style="{'background-image': 'url('+ currentSongImg +')'}">
        <div class="cover-color"></div>
      </div>
      <mPlayerTop/>
      <mPlayerCenter/>
      <mPlayerBottom/>
    </div>
  </div>
</template>

<script>
import mPlayerTop from './components/mPlayerTop'
import mPlayerCenter from './components/mPlayerCenter'
import mPlayerBottom from './components/mPlayerBottom'

export default {
  name: 'mPlayer',
  components: {
    mPlayerTop,
    mPlayerCenter,
    mPlayerBottom
  },
  data () {
    return {
      songImg: require('./assets/logo.jpg')
    }
  },
  computed: {
    currentSongImg () {
      return this.$store.state.currentSongImg || require('./assets/logo.jpg')
    },
    showPlayer () {
      return this.$store.state.showPlayer
    }
  },
  methods: {
    showInfo () {
      console.info('欢迎使用mPlayer!')
    },
    openPlayer () {
      this.$store.commit('showPlayer', true)
    }
  }
}
</script>

<style>
@import './assets/iconfont.css';
#mplayer {
  position: absolute;
  left: 0;
  bottom: 0;
  font-family: "Helvetica neue",Helvetica,Tahoma,"lantinghei sc","Microsoft Yahei",sans-serif,monospace;
  -webkit-font-smoothing: antialiased;
}
#mplayer-box {
  position: absolute;
  left: 0;
  bottom: 0;
  height: 380px;
  width: 680px;
  background-color:#333;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);
  transition-duration: 800ms;
}
#mplayer-box * {
  box-sizing: border-box;
}
#show-mplayer {
  position: absolute;
  left: 0;
  bottom: 50px;
  width: 50px;
  height: 50px;
  cursor: pointer;
  overflow: hidden;
}
.fade-enter-active {
  transform: translate(0, 0);
  transition: opacity 500ms ease-out 300ms, transform 500ms linear;
}
.fade-leave-active {
  transform: translate(20px, 50px);
  transition: opacity 500ms ease-out 300ms, transform 300ms linear 300ms;
}
.fade-enter {
  transform: translate(50px, 50px);
  opacity: 0;
}
.fade-leave-to {
  opacity: 0;
}
.show-player-bar {
  height: 50px;
  width: 50px;
  background-position: center center;
  background-size: cover;
  transition: background-image 200ms ease-out, transform 200ms ease-out;;
}
.show-player-bar:hover {
  transform: scale(1.5);
}
.mplayer-cover {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-position: center center;
  background-size: cover;
  filter: blur(100px);
  transition: background-image 200ms ease-out;
}
.cover-color {
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,.3);
}
</style>
