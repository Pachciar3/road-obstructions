<?php
$LINK    = 'https://www.gddkia.gov.pl/dane/zima_html/utrdane.xml';
$getID   = false;
$voi     = false;
$q       = false;
$nameGET = false;
if (isset($_GET['voi']) && isset($_GET['name'])) {
 $type    = "ROAD_NAME";
 $voi     = $_GET['voi'];
 $nameGET = strtolower($_GET['name']);
} else if (isset($_GET['voi'])) {
 $type = "SEARCHING";
 $voi  = $_GET['voi'];
 $q    = isset($_GET['q']) ? strtolower($_GET['q']) : false;
} else if (isset($_GET['id'])) {
 $type  = "ONE_ELEMENT";
 $getID = $_GET['id'];
}
$response = array();
$posts    = array();
function generator($emp1, $id)
{
 $key         = $id;
 $road_name   = $emp1->nr_drogi;
 $road_km     = $emp1->km;
 $length      = $emp1->dl;
 $name        = $emp1->nazwa_odcinka;
 $road_detour = $emp1->objazd;
 $voivodeship = $emp1->woj;
 $start_day   = $emp1->data_powstania;
 $end_day     = $emp1->data_likwidacji;

 $posts = array('key' => $key,
  'road_name'          => (string) $road_name,
  'road_km'            => (string) $road_km,
  'length'             => (string) $length,
  'name'               => (string) $name,
  'road_detour'        => (string) $road_detour,
  'voivodeship'        => (string) $voivodeship,
  'start_day'          => (string) $start_day,
  'end_day'            => (string) $end_day,
 );
 return $posts;
}

if (!$str_xml = @file_get_contents($LINK)) {
 $header = $http_response_header;
 header($header[0]);
 echo "Problem z pobraniem danych " . substr($header[0], 9, 3);

} else {
 $obj_xml = new SimpleXMLElement($str_xml);
 $id      = 0;
 if ($type === "ONE_ELEMENT") {
  foreach ($obj_xml->children() as $emp1) {
   if ($id == $getID) {
    $posts[] = generator($emp1, $id);
    break;
   }
   $id++;
  }
 } else if ($type === "SEARCHING") {
  foreach ($obj_xml->children() as $emp1) {
   if (($voi == $emp1->woj || $voi === "wszystkie") && (strpos(strtolower($emp1->nr_drogi), $q) !== false || $q === false)) {
    $posts[] = generator($emp1, $id);
   }
   $id++;
  }
 } else if ($type === "ROAD_NAME") {
  foreach ($obj_xml->children() as $emp1) {
   if (($voi == $emp1->woj || $voi === "wszystkie") && strtolower($emp1->nr_drogi) === $nameGET) {
    $posts[] = generator($emp1, $id);
   }
   $id++;
  }
 } else {
  foreach ($obj_xml->children() as $emp1) {
   $posts[] = generator($emp1, $id);
   $id++;
  }
 }
 $response['obstructions'] = $posts;
 echo json_encode($response);
}
// $fp = fopen('results.json', 'w');
// fwrite($fp, json_encode($response));
// fclose($fp);
