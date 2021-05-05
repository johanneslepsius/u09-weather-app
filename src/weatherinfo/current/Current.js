import React from 'react';

const getTime = (unixTime, type) => {
  const date = new Date(unixTime * 1000);
  switch (type){
  case "HOUR":
    return date.getHours() + ":00";
  case "HOUR_MINUTES":
    return `${date.getHours()}:${date.getMinutes()}`;
  default:
    throw new Error();
  };
};

const Current = ({current, hourly}) => {
  const [currentweather] = current.weather;
  const getUrl = id => (`http://openweathermap.org/img/wn/${id}.png`);
  const everyThirdHour = hourly.filter((e, i) => i % 3 === 2 && i < 24);
  console.log(everyThirdHour);
return (
  <div>
    <img src={getUrl(currentweather.icon)} alt=""/>
    <p key={currentweather.id}>{currentweather.main}: {currentweather.description}</p>
    <p>
      <span>{Math.round(current.temp)}°C</span><br/>
      <span>Feels like {Math.round(current.feels_like)}</span>
    </p>
    <p>
      <span>Sunrise: {getTime(current.sunrise, "HOUR_MINUTES")}</span><br/>
      <span>Sunset: {getTime(current.sunset, "HOUR_MINUTES")}</span>
    </p>
    <p>Wind: {Math.round(current.wind_speed * 3.6)} km/h</p>
    <p>Humidity: {current.humidity}%</p>
    {/* <Hourly hourly={hourly}></Hourly> */}
    {everyThirdHour.map(e => 
      <div>
        <img src={getUrl(e.weather[0].icon)} alt=""/>
        <p>{getTime(e.dt, "HOUR")}</p>
        <p key={e.weather[0].id}>{e.weather[0].main}: {e.weather[0].description}</p>
        <p>{Math.round(e.temp)}°C</p>
        <p>Wind: {Math.round(e.wind_speed * 3.6)} km/h</p>
        <p>Humidity: {e.humidity}%</p>
      </div>)}

  </div>
)
};

export default Current;