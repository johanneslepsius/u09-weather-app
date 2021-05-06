import React from 'react';

const getTime = (unixTime, type) => {
  const date = new Date(unixTime * 1000);
  switch (type){
  case "HOUR":
    return date.getHours() + ":00";
  case "HOUR_MINUTES":
    return `${date.getHours()}:${date.getMinutes()}`;
  case "DAY":
    return date.getDate();
  default:
    throw new Error();
  };
};


const getUrl = id => (`http://openweathermap.org/img/wn/${id}.png`);

const Current = ({current, units}) => {
  const [currentweather] = current.weather;
return (
  <div>
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

export {Current, getUrl, getTime};