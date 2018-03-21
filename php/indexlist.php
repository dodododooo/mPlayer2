<?php
header("Access-Control-Allow-Origin:*");
header("Content-Type:application/json;charset=utf-8");
require 'Meting.php';

use Metowolf\Meting;

// Initialize to netease API
$API = new Meting('netease');

$API->cookie('os=pc; osver=Microsoft-Windows-10-Professional-build-10586-64bit; appver=2.0.3.131777; channel=netease; __remember_me=true');
$get = isset($_GET) ? $_GET : null;


if($get['data'] == "推荐"){
    $data = $API->format(true)->playlist(490778650);
}else if($get['data'] == "歌单"){
    $data = $API->format(true)->playlist(104183571);
}else {
    $res['songList'] = [];
    $sub = json_encode($res);
    echo $_GET["jsoncallback"]."(".$sub.")";
    return;
}
$songs = json_decode($data);
foreach ($songs as $index => $value) {
        $res['songList'][$index] = $value;
    }

$sub = json_encode($res);

echo $_GET["jsoncallback"]."(".$sub.")";


