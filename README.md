mPlayer2
========
---
### A web music player based on VUE and IndexedDB

mPlayer2是基于mPlayer全新升级版的web端音乐播放器，在mPlayer (http://dodododooo.com/#/post?postId=2) 的基础上代码全部重构，重新规划了界面布局，前端采用VUE+IndexedDB，增加了歌曲收藏列表和在线搜索功能，歌词显示以独立界面显示，保留并兼容mPlayer的全局调用接口，可实现web端独立的音乐播放器功能和页面歌曲播放功能；后端全部切换到  ``` Meting ```，升级更加快捷方便，是一款全功能的web端音乐播放器。


### 演示地址
http://dodododooo.com/#/music

### 界面预览
![列表界面](https://github.com/dodododooo/mPlayer2/blob/master/images/playlist.png)

![播放界面](https://github.com/dodododooo/mPlayer2/blob/master/images/playing.png)

![歌词界面](https://github.com/dodododooo/mPlayer2/blob/master/images/lrc.png)

### 使用方法
----
**页面引用**

 编译后引入相关js, css文件即可

 **免编译远程调用**

 页面直接引用远程js,css文件
 ``` <html> ```
 ``` <head> ```
 ``` <meta charset="UTF-8"> ```
 ``` <link rel=stylesheet type=text/css href="http://dodododooo.com/mplayer2/remote/css/app-mplayer.css"></link> ```
 ``` </head> ```
 ``` <body> ```
 ``` <script type=text/javascript src=http://dodododooo.com/mplayer2/remote/js/app-mplayer.js></script> ```
 ``` </body> ```
 ``` </html> ```

**方法调用**

```pl.addTo($.parseJSON(songObject),isPlay) //添加歌曲到列表```

参数1：```songObject = {songId: 1773698125, songTitle: "定西", artist: "李志", urlId: 1773698125, album: "1701", lyricId: 1773698125, songImg: 1773698125, source: 'xiami'}```

参数2：```isPlay //true 添加并播放，false 添加到列表```

### 浏览器支持
支持 Chrome、firefox、Edge 等现代浏览器，IE浏览器下背景图片滤镜功能未作兼容。

### 鸣谢
（厚颜无耻地）特别感谢 @metowolf、网易云音乐、QQ音乐、虾米、酷狗、百度音乐的大力支持！！！！

### 链接
Meting：全功能平台音乐 API PHP框架 https://github.com/metowolf/Meting

VUE：渐进式JavaScript MVVM框架 https://cn.vuejs.org/v2/guide/

dodododooo：个人博客 http://dodododooo.com

### 其他
本软件采用MIT开源协议，可随意更改和非商业用途的使用，音乐版权归各音乐公司所有，使用或转载时 ```请务必保留出处```。
