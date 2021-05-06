import React from 'react';
import {getTime, getUrl} from '../current/Current';


const Infocard = ({data, daily, units}) => {
return (
    <div>
    {data.map(e => 
      <div key={e.dt}>
        <img src={getUrl(e.weather[0].icon)} alt=""/>
        {daily ? (
          <>
          <p>{getTime(e.dt, "DAY")}</p>
          <p>{`${Math.round(e.temp.min)} - ${Math.round(e.temp.max)}`} {units.temp}</p>
          </>
        ):(
          <>
          <p>{getTime(e.dt, "HOUR")}</p>
          <p>{Math.round(e.temp)} {units.temp}</p>
          </>
        )}
        <p key={e.weather[0].id}>{e.weather[0].main}: {e.weather[0].description}</p>
        <p>Wind: {Math.round(e.wind_speed * 3.6)} {units.wind}</p>
        <p>Humidity: {e.humidity}%</p>
      </div>)}
      </div>
);
};

export default Infocard;