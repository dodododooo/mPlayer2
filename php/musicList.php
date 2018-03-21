<?php

header("Content-Type:application/javascript;charset=utf-8");

$get = isset($_GET) ? $_GET : null;



if($get['data'] == "推荐"){
    get_tui();
}else if($get['data'] == "歌单"){
    get_list();
}else {
    $res['songList'] = [];
    $sub = json_encode($res);
    echo $_GET["jsoncallback"]."(".$sub.")";
    return;
}

function get_hot(){
    $url = "http://music.163.com/discover/toplist?id=3778678";

    $ch = curl_init();
    $header = array(
            'Accept : */*',
            'Accept-Encoding : gzip,deflate,sdch',
            'Accept-Language : zh-CN,zh;q=0.8,gl;q=0.6,zh-TW;q=0.4',
            'Connection : keep-alive',
            'Content-Type : application/x-www-form-urlencoded',
            'Host : music.163.com',
            'Referer : http://music.163.com/search/',
            'User-Agent : Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.152 Safari/537.36',
            'appver : 1.5.2'
            );
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
    $output = curl_exec($ch);
    print_r($output);
    $htmlStr = "/<ul class=\"f-hide\"><li>.*?<\/a><\/li><\/ul>/sim";
    preg_match($htmlStr, $output, $html);

    

    //$h=simplexml_load_file($htmlStr);   

    //print_r($html);
}









function get_list()
{
    $url = "http://music.163.com/api/playlist/detail?id=104183571&updateTime=-1";
    
    $ch = curl_init();
    $header = array("Cookie: " . "appver=1.5.0.75771;");
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
    $output = curl_exec($ch);
    curl_close($ch);
    $obj = json_decode($output,true);
 
    $songs = $obj['result']['tracks'];
    $res = [];
    foreach ($songs as $index => $value) {
        $res['songList'][$index]['songId'] = $value['id'];
        $res['songList'][$index]['songTitle'] = $value['name'];
        $res['songList'][$index]['artist'] = $value['artists'][0]['name'];
        $res['songList'][$index]['songImg'] = $value['album']['picUrl'];
    }
    $sub = json_encode($res);
    echo $_GET["jsoncallback"]."(".$sub.")";
    return;
}

function get_tui()
{
    $url = "http://music.163.com/api/playlist/detail?id=490778650&updateTime=-1";
    
    $ch = curl_init();
    $header = array("Cookie: " . "appver=1.5.0.75771;");
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
    $output = curl_exec($ch);
    curl_close($ch);
    $obj = json_decode($output,true);
    //getObj($obj);
    $songs = $obj['result']['tracks'];
    $res = [];
    foreach ($songs as $index => $value) {
        $res['songList'][$index]['songId'] = $value['id'];
        $res['songList'][$index]['songTitle'] = $value['name'];
        $res['songList'][$index]['artist'] = $value['artists'][0]['name'];
        $res['songList'][$index]['songImg'] = $value['album']['picUrl'];
    }
    $sub = json_encode($res);
    echo $_GET["jsoncallback"]."(".$sub.")";
    return;
}


function getObj($obj){
    $ret = array();
    foreach ($obj as $key => $value) {
        if(gettype($value) == 'array' || gettype($value) == 'object'){
            $ret[$key] = getObj($value);
        }else{
            $ret[$key] = $value;
        }
    }
    print_r($ret);
}
