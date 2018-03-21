<template>
  <div class="mplayer-top">
    <div  v-for="(item, index) in tabList" :key="index"
      class="top-bar"
      v-bind:class="{'top-bar-active': activeTab === index}"
      @click="changeTab(index)">{{item}}</div>
    <div class="top-bar-search">
      <i v-on:click="isShowResList = !isShowResList" class="res-btn res-icon iconfont" v-bind:class="'icon-' + currentSource"></i>
      <div v-show="isShowResList" class="res-list">
        <ul>
          <li v-for="item in sourceList"
            v-bind:key="item"
            class="res-icon res-icon-list"
            v-on:click="changeResouce(item)">
            <i class="iconfont" v-bind:class="'icon-' + item"></i>
          </li>
        </ul>
      </div>
      <input v-model="keyWords" class="search-input" type="text" placeholder="发现音乐，发现美好生活">
      <i class="search-icon iconfont icon-sousuo"
        v-on:click="toSearch"></i>
    </div>
    <div class="top-bar-btn" v-on:click="hidePlayer">
      <i class="top-bar-icon iconfont icon-delete"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'mPlayerTop',
  data () {
    return {
      tabList: ['播放列表', '收藏列表', '搜索列表'],
      keyWords: '',
      isShowResList: false,
      currentSource: 'netease',
      sourceList: ['netease', 'xiami', 'tencent', 'kugou', 'baidu']
    }
  },
  computed: {
    activeTab () {
      return this.$store.state.activeTab
    },
    showLyric () {
      return this.$store.state.showLyric
    }
  },
  methods: {
    changeTab (index) {
      this.$store.commit('showLyric', false)
      this.$store.commit('changeTab', index)
    },
    changeResouce (newRes) {
      this.currentSource = newRes
      this.isShowResList = false
    },
    toSearch () {
      if (this.keyWords) {
        this.$store.dispatch('searchSong', {keyWords: this.keyWords, source: this.currentSource})
        this.$store.commit('changeTab', 2)
        this.$store.commit('showLyric', false)
      }
    },
    hidePlayer () {
      this.$store.commit('showPlayer', false)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mplayer-top {
    position: relative;
    height: 40px;
    width: 100%;
    padding: 0 20px;
    color: #ddd;
    font-size: 15px;
    background-color: rgba(0, 0, 0, .2)
}
.top-bar {
  display: inline-block;
  height: 40px;
  line-height: 40px;
  width: 80px;
  text-align: center;
  cursor: pointer;
}
.top-bar-active, .top-bar:hover{
  border-bottom: 2px solid #ff0000;
  color: #fff;
  background-color:  rgba(0, 0, 0, .1);
}
.top-bar-search {
  position: absolute;
  top: 0;
  right: 50px;
  height: 40px;
  width: 300px;
  padding: 5px 0;
  font-size: 0;
}
.res-btn {
  position: absolute;
  top: 5px;
  left: 0;
  height: 30px;
  width: 30px;
  border: 1px solid rgba(221, 221, 221, 0.26);
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
}
.res-icon {
  height: 30px;
  width: 30px;
  line-height: 30px;
  text-align: center;
  color: #aaa;
  cursor: pointer;
}
.res-icon:hover {
  color: #ddd;
}
.res-icon-list {
  display: inline-block;
}
.res-list {
  position: absolute;
  top: 40px;
  left: 0;
  border: 1px solid rgba(221, 221, 221, 0.26);
  border-radius: 5px;
  z-index: 99;
}
.res-list ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.search-input {
  height: 30px;
  width: 240px;
  padding: 5px 10px;
  margin-left: 30px;
  color: #ddd;
  border: 1px solid rgba(221, 221, 221, 0.26);
  border-left: none;
  border-right: none;
  background-color: transparent;
}
.search-input:focus {
    outline: none;
}
.search-input::-webkit-input-placeholder { /* WebKit, Blink, Edge */
    color:#b2b2b2;
}
.search-input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color:#b2b2b2;
}
.search-input::-moz-placeholder { /* Mozilla Firefox 19+ */
    color:#b2b2b2;
}
.search-input:-ms-input-placeholder { /* Internet Explorer 10-11 */
    color:#b2b2b2;
}

.search-icon {
    display: inline-block;
    height: 30px;
    line-height: 30px;
    width: 30px;
    color: #aaa;
    cursor: pointer;
    text-align: center;
    font-size: 15px;
    vertical-align: bottom;
    border: 1px solid rgba(221, 221, 221, 0.26);
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
}
.search-icon:hover {
    color: #ddd;
}
.top-bar-btn {
  position: absolute;
  top: 0;
  right: 10px;
  height: 40px;
  width: 30px;
  font-size: 0;
}

.top-bar-icon {
    display: inline-block;
    height: 40px;
    line-height: 40px;
    width: 30px;
    color: #aaa;
    text-align: center;
    cursor: pointer;
}
.top-bar-icon:hover {
    color: #ddd;
}
</style>
