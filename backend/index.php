<?php
header("Access-Control-Allow-Origin: *");
$citiesJSON = file_get_contents('./city.list.json');
$cities = json_decode($citiesJSON, true);

$query = $_GET['query'];
$citiesResponse = [];

if ($query) {
    foreach ($cities as $city => $value) {
        if (stripos($value["name"], $query) !== false) {
            array_push($citiesResponse, ['name' => $value["name"], 'country' => $value["country"], 'geolocation' => ['latitude' => $value['lat'], 'longitude' => $value['lng']]]);
        };
    };
};

echo (json_encode($citiesResponse));
