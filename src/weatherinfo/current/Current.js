import React from 'react';
import {getTime, getUrl} from '../Weatherinfo';


const Current = ({current, units}) => {
  const [currentweather] = current.weather;
return (
  <div class="card">
    <img src={getUrl(currentweather.icon)} alt=""/>
    <p key={currentweather.id}>{currentweather.main}: {currentweather.description}</p>
    <p>
      <span>{Math.round(current.temp)}{units.temp}</span><br/>
      <span>Feels like {Math.round(current.feels_like)}</span>
    </p>
    <p>
      <span>Sunrise: {getTime(current.sunrise, "HOUR_MINUTES")}</span><br/>
      <span>Sunset: {getTime(current.sunset, "HOUR_MINUTES")}</span>
    </p>
    <p>Wind: {Math.round(current.wind_speed * 3.6)} {units.wind}</p>
    <p>Humidity: {current.humidity}%</p> 
  </div>
)
};

export default Current;