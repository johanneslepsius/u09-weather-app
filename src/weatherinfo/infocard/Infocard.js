import React from 'react';
import {getTime, getUrl} from '../current/Current';


const Infocard = ({data, daily}) => {
return (
    <>
    {data.map(e => 
      <div>
        <img src={getUrl(e.weather[0].icon)} alt=""/>
        <p>{daily ? (getTime(e.dt, "DAY")
        ):(
            getTime(e.dt, "HOUR")
        )}</p>
        <p key={e.weather[0].id}>{e.weather[0].main}: {e.weather[0].description}</p>
        <p>{daily ? (`${Math.round(e.temp.min)} - ${Math.round(e.temp.max)}`
            ):(Math.round(e.temp))
        }°C</p>
        <p>Wind: {Math.round(e.wind_speed * 3.6)} km/h</p>
        <p>Humidity: {e.humidity}%</p>
      </div>)}
      </>
);
};

export default Infocard;