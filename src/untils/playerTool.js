/* eslint-disable */
(function (window, document) {
let MPlayer = function () {
  this.start();
}
MPlayer.prototype = {
  async start() {
    let m_elements = await this.findMusicElements();
    if (!m_elements || !m_elements.length) return;
    for (let i = 0; i < m_elements.length; i++) {
      const m_element = m_elements[i];
      await this.initMusicElement(m_element);
    }
  },
  async clickMusic(e, m_element, music) {
    let isPlay = e.target.className == 'iconfont icon-play m-music-play-icon';
    let isPause = e.target.className == 'iconfont icon-pause m-music-play-icon';
    if (isPlay) {
      window.pl.addTo(music, 1, 1);
      // this.setMusicStatus(`${music.source}_${music.songId}`);
    } else if (isPause) {
      window.pl.doPause();
      // this.setMusicStatus(``);
    }
  },
  async setMusicStatus(currentSong) {
    let m_elements = await this.findMusicElements();
    if (!m_elements || !m_elements.length) return;
    for (let i = 0; i < m_elements.length; i++) {
      const element = m_elements[i];
      element.dataset.current = currentSong == element.dataset.song;
    }
  },
  findMusicElements() {
    return new Promise(resolve => {
      let m_element = null;
      let i = 0;
      let timer = setInterval(() => {
        i++;
        m_element = document.getElementsByClassName('m-mplayer-music');
        if (m_element || i > 20) {
          clearInterval(timer);
          resolve(m_element);
          return;
        }
      }, 500);
    })
  },
  initMusicElement(m_element) {
    return new Promise(resolve => {
      if (!m_element || !m_element.dataset || !m_element.dataset.music) return resolve();
      if (m_element.dataset.render == 'render') return resolve(); // 已经渲染过
      m_element.dataset.render = 'render';
      let m = m_element.dataset.music;
      try {
        m = JSON.parse(unescape(m));
      } catch (error) {
        m = null;
      }
      // 参数1： songObject = {"songId":1857630559,"songTitle":"New Boy","artist":"房东的猫/陈婧霏","urlId":1857630559,"album":"谁是宝藏歌手 第8期","lyricId":1857630559,"songImg":"109951166077317301","source":"netease"}
      let {songId, songTitle, artist, album, songImg, source} = m;
      let current = window.mPlayerCurrentSong || '';
      m_element.dataset.current = current == `${source}_${songId}`;
      m_element.dataset.song = `${source}_${songId}`;
      if (!m) return resolve();
      let htmlStr = `
        <div class="m-music-bg"></div>
        <img class="m-music-img" src="https://dodododooo.com/mplayer2/logo.jpg" />
        <div class="m-music-info">
          <div style="flex: 1; padding-right: 10px; overflow: hidden;">
            <p class="m-title text-ellipsis">${songTitle || 'dodododooo'}</p>
            <p class="m-artist text-ellipsis">艺术家: ${artist || 'dodododooo'}</p>
            <p class="m-album text-ellipsis">专辑: ${album || 'dodododooo'}</p>
          </div>
          <div class="m-music-play">
            <i class="iconfont icon-play m-music-play-icon"></i>
            <i class="iconfont icon-pause m-music-play-icon"></i>
          </div>
        </div>
      `;
      m_element.innerHTML = htmlStr;
      m_element.addEventListener('click', e => this.clickMusic(e, m_element, m));
      fetch('https://dodododooo.com/mplayer2/php/index.php', {
        method: 'POST',
        body: `request[action]=pic&request[data]=${songImg}&request[format]=8`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        type: ''
      }).then(res => res.json()).then(res => {
        let url = res.url;
        if (url) {
          m_element.querySelector('.m-music-bg').style.backgroundImage = `url(${url})`;
          m_element.querySelector('.m-music-img').src = url;
        }
        m_element.style.display = 'flex';
        resolve();
      }).catch(e => {
        m_element.style.display = 'flex';
        resolve();
      })
    })
  },
}

let mPlayer = new MPlayer();

// 单页面应用
window.addEventListener('hashchange', e => {
  mPlayer.start();
})

// 舰艇播放事件
window.addEventListener('mPlayerChangeSong', e => {
  mPlayer.setMusicStatus(e.detail);
})

window.mPlayer = mPlayer;

})(window, document);
