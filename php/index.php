<?php
header("Access-Control-Allow-Origin:*");
header("Content-Type:application/json;charset=utf-8");
require 'Meting.php';

use Metowolf\Meting;

$request = isset($_POST['request']) ? $_POST['request'] : die();

$source = isset($request['source']) ? $request['source'] : 'netease';
$action = $request['action'];
$data = $request['data'];

$server = $_SERVER;
$host = isset($server['HTTP_ORIGIN']) ? $server['HTTP_ORIGIN'] : 'none';
$addr = isset($server['HTTP_REFERER']) ? $server['HTTP_REFERER'] : 'none';
$query = is_array($data) ? implode('/', $data) : $data;
file_put_contents(dirname(__FILE__)."/log/request.csv", date('Y-m-d H:i:s').",".$host.",".$addr.",".$action.",".$source.",".$query."\r\n",FILE_APPEND);

$cookie = 'os=pc; osver=Microsoft-Windows-10-Professional-build-10586-64bit; appver=2.0.3.131777; channel=netease; __remember_me=true';

$API = new Meting($source);
$API->cookie($cookie);

if ($action === 'songInfo') {
	if ($source == 'netease') {
		$songUrl = get_headers("http://music.163.com/song/media/outer/url?id=".$data['urlId'].".mp3", TRUE)['Location'];
	} else {
		$songUrl = json_decode($API->format(1)->url($data['urlId']), true)['url'];
	}
	$lyric = formatLyric(json_decode($API->format(1)->lyric($data['lyricId']), true)['lyric']);
	
	$result = array(
		'songImg' => json_decode($API->format(1)->pic($data['songImg']), true)['url'],
		'songUrl' => $songUrl,
		'lyric' => $lyric,
	);
	
} else {
	$data = json_decode($API->format(1)->$action($data), true);
	$result = array();
	foreach ($data as $index => $value) {
		$result[$index] = formatList($value);
	}
}

echo json_encode($result);



function formatList ($data) {
	$arr = array(
            'songId'     => $data['id'],
            'songTitle'  => $data['name'],
            'artist'     => count($data['artist']) > 1 ? implode('/', $data['artist']) : $data['artist'][0],
			'urlId'      => $data['url_id'],
            'album'      => $data['album'],
			'lyricId'    => $data['lyric_id'],
            'songImg'    => $data['pic_id'],
            'source'     => $data['source'],
        );
	return $arr;
}

function formatLyric ($lyricStr) {
	$reg = "/[0-9]{2}[:][0-9]{2}\.[0-9]*\].+(\r\n|\n|)/im";
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
















