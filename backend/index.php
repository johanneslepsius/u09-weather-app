<?php
header("Access-Control-Allow-Origin: *");
$citiesJSON = file_get_contents('./citylist.json');
$cities = json_decode($citiesJSON, true);

$query = $_GET['query'];
var_dump($query);
$citiesResponse = [];

if ($query) {
    foreach ($cities as $city => $value) {
        if (stripos($value["name"], $query) !== false) {
            array_push($citiesResponse, ['name' => $value["name"], 'country' => $value["country"], 'geolocation' => ['latitude' => $value['coord']['lat'], 'longitude' => $value['coord']['lon']]]);
        };
    };
};

echo (json_encode($citiesResponse));
