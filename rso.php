<?php
// Support for RSO database is not finished
$voi  = isset($_GET['voi']) ? strtolower($_GET['voi']) : "wszystkie";
$page = isset($_GET['page']) ? strtolower($_GET['page']) : "1";
$url  = 'https://komunikaty.tvp.pl/komunikatyxml/' . $voi . '/informacje-drogowe/' . $page . '?_format=json';
if (!$JSON = file_get_contents($url)) {
 header("HTTP/1.1 301 Moved Permanently");
 echo "Problem z pobraniem danych";
}
$JSON = file_get_contents($url);
$data = json_decode($JSON);
echo json_encode($data);
