mPlayer2
========
---
# 声明
# 本插件仅供个人学习研究使用，请勿作为各种商业用户，音乐版权归各音乐平台所有。
### A web music player based on VUE and IndexedDB

mPlayer2是基于mPlayer全新升级版的web端音乐播放器，在mPlayer的基础上代码全部重构，重新规划了界面布局，前端采用VUE+IndexedDB，增加了歌曲收藏列表和在线搜索功能，歌词显示以独立界面显示，保留并兼容mPlayer的全局调用接口，可实现web端独立的音乐播放器功能和页面歌曲播放功能；后端全部切换到  ``` Meting ```，升级更加快捷方便，是一款全功能的web端音乐播放器。


### 演示地址
[演示地址](https://dodododooo.com/2021/11/29/music.html#mplayer2-%E6%BC%94%E7%A4%BA)

### 界面预览
![列表界面](https://github.com/dodododooo/mPlayer2/blob/master/images/playlist.png)

![播放界面](https://github.com/dodododooo/mPlayer2/blob/master/images/playing.png)

![歌词界面](https://github.com/dodododooo/mPlayer2/blob/master/images/lrc.png)

### 使用方法
 ```html
<html>
  <head>
    <meta charset="UTF-8">
    <link rel=stylesheet type=text/css href="https://dodododooo.com/mplayer2/remote/css/app-mplayer.css"></link>
  </head>
  <body>
    <script type=text/javascript src=https://dodododooo.com/mplayer2/remote/js/app-mplayer.js></script>
  </body>
</html>
```
**方法调用**
```javascript
pl.addTo($.parseJSON(songObject),isPlay) //添加歌曲到列表
// 参数1： songObject = {songId: 1773698125, songTitle: "定西", artist: "李志", urlId: 1773698125, album: "1701", lyricId: 1773698125, songImg: 1773698125, source: 'xiami'}
// 参数2： isPlay //true 添加并播放，false 添加到列表

```



```bash
2021-09-11 更新  
新增页面音乐卡片
  使用方法： 
    1，音乐列表右键复制音乐信息, 得到音乐信息，如：XXXXX 
    2，在页面中插入页面卡片 <div class="m-mplayer-music" data-music="XXXXX"></div>
删除百度虾米音源，删除推荐歌曲列表
LastFM 更新为每5分钟更新一次
```

### 浏览器支持
支持 Chrome、firefox、Edge 等现代浏览器，IE浏览器下背景图片滤镜功能未作兼容。

### LastFM scrobble
记录歌曲播放记录到LastFM, 每5分钟同步一次

查看地址： https://www.last.fm/zh/user/dodododooo

### 链接
Meting：全功能平台音乐 API PHP框架 https://github.com/metowolf/Meting

VUE：渐进式JavaScript MVVM框架 https://cn.vuejs.org/v2/guide/

dodododooo：个人博客 http://dodododooo.com

### 其他
本软件采用MIT开源协议，可随意更改和非商业用途的使用，音乐版权归各音乐公司所有，使用或转载时 ```请务必保留出处```。
