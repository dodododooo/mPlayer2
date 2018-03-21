<?php
header("Access-Control-Allow-Origin:*");
header("Content-Type:application/json;charset=utf-8");


$s = isset($_POST['query']) ? $_POST['query'] : '123';

$url="http://music.163.com/artist/desc?id=".$s;



artinfo($url);
function artinfo($url){
$curl = curl_init();
    curl_setopt($curl, CURLOPT_URL,$url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER,1);

    $header =array(
    'Host: music.163.com',
    'Origin: http://music.163.com',
    'User-Agent: Mozilla/46.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.90 Safari/537.36',
    'Content-Type: text/html',
    'Referer: http://music.163.com/',
    );

    curl_setopt($curl, CURLOPT_HTTPHEADER, $header);

    $src = curl_exec($curl);
    curl_close($curl);

    $desc="/<div class=\"n-artdesc\".*?>.*?<\/div>/ism"; 
    if(preg_match($desc, $src, $artdesc)){ 
            $atr['artdesc'] = $artdesc[0];
        }else{ 
            $atr['artdesc'] = '暂无简介！';
    }
    $img="/<div class=\"n-artist f-cb\".*?>.*?<\/div>.*?<\/div>/ism"; 
    if(preg_match($img, $src, $imgpath)){ 
        $imgsrc="/http.*?.y300/ism";
        preg_match($imgsrc, $imgpath[0], $imgurl);
        $atr['imgurl'] = $imgurl[0];
        }else{ 
            $atr['imgurl'] = 0;
    }
    $res = array("res"=>$atr);
    $info = json_encode($res,JSON_FORCE_OBJECT);
    print_r($info);
}


