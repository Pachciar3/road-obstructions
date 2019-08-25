<?php
$LINK       = 'https://www.gddkia.gov.pl/dane/zima_html/utrdane.xml';
$q          = isset($_GET['q']) ? strtolower($_GET['q']) : false;
$voi        = isset($_GET['voi']) ? strtolower($_GET['voi']) : false;
$road_names = array();
if (!$str_xml = @file_get_contents($LINK)) {
 $header = $http_response_header;
 header($header[0]);
 echo "Problem z pobraniem danych " . substr($header[0], 9, 3);

} else {
 $obj_xml = new SimpleXMLElement($str_xml);
 $id      = 0;
 foreach ($obj_xml->children() as $el) {
  if (($voi == $el->woj || $voi === "wszystkie") && (strpos(strtolower($el->nr_drogi), $q) !== false || $q === false)) {
   if (in_array($el->nr_drogi, $road_names) === false) {
    $road_names[] = (string) $el->nr_drogi;
   }
  }
  $id++;
 }
 $response['road_names'] = $road_names;
 echo json_encode($response);
//  $fp = fopen('road_names.json', 'w');
 //  fwrite($fp, json_encode($response));
 //  fclose($fp);
}
