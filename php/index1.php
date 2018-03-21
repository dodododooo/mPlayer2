<?php
header("Access-Control-Allow-Origin:*");
header("Content-Type:application/json;charset=utf-8");
require 'Meting.php';

use Metowolf\Meting;

// Initialize to netease API





$cookie = 'os=pc; osver=Microsoft-Windows-10-Professional-build-10586-64bit; appver=2.0.3.131777; channel=netease; __remember_me=true';

$API = new Meting('tencent');
$API->cookie($cookie);

//$data = $API->format(1)->lyric('004Rj1J00dbyQa');
//exit($data);


$kk = formatLyric(json_decode($API->format(1)->lyric('004Rj1J00dbyQa'), true)['lyric']);
function formatLyric ($lyricStr) {
	$reg = "/[0-9]{2}[:][0-9]{2}\.[0-9]*\].+(\r\n|\n)/im";
	preg_match_all($reg, $lyricStr, $result);
	$rows = $result[0];
	if (count($rows) > 0) {
		foreach($rows as $index => $value) {
			$line = explode(']', $value);
			$timestr = explode(":", $line[0]);
			$second = isset($timestr[1]) ? $timestr[1] : 0;
			$time = (string)($timestr[0]*60 + $second)*1000;
			$lyric[$time] = $line[1];
		}
		return $lyric;
	} else {
		return [];
	}
}
print_r($kk);
exit;

$data = json_decode($API->format(1)->search('lizhi'), true);
	$result = array();
	foreach ($data as $index => $value) {
		$result[$index] = format($value);
	}
	
	echo json_encode($result);



function format ($data) {
	$arr = array(
            'songId'     => $data['id'],
            'songTitle'  => $data['name'],
            'artist'     => $data['artist'],
			'urlId'      => $data['url_id'],
            'album'      => $data['album'],
			'lyricId'    => $data['lyric_id'],
            'songImg'    => $data['pic_id'],
            'source'     => $data['source'],
        );
	return $arr;
}

