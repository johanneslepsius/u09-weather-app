import React from 'react';
import {getTime, getUrl} from '../Weatherinfo';
import { ReactComponent as Raindrop } from "../raindrop.svg";
import { ReactComponent as Arrow } from "../arrow.svg";


const Infocard = ({data, daily, units}) => {
return (
    <div className="card">
    {data.map(e => 
      <Infoitem 
        key={e.dt} 
        e={e} 
        daily={daily} 
        units={units}
      />
      )}
      </div>
);
};

const Infoitem = ({e, daily, units}) => {
  const [expanded, setExpanded] = React.useState(false);
  const description = e.weather[0].description.charAt(0).toUpperCase() + e.weather[0].description.slice(1);
  return (
    <div className="infoitem" onClick={() => setExpanded(!expanded)}>
      <div className="infocontent">
        {daily ? (
            <p><b>{getTime(e.dt, "DAY")}</b></p>
        ):(
            <p><b>{getTime(e.dt, "HOUR")}</b></p>
        )}
        <div className="contentgroup">
          <img className="weathericon" src={getUrl(e.weather[0].icon)} alt=""/>
          <p key={e.weather[0].id}>{description}</p>
        </div>
        <div className="contentgroup">
          <p>Wind:&nbsp;{Math.round(e.wind_speed * 3.6)}&nbsp;{units.wind}
            <Arrow height="13px" style={{transform: `rotate(${e.wind_deg}deg`}}/>
          </p>
          {daily
            ? <p>{`${Math.round(e.temp.min)} - ${Math.round(e.temp.max)}`}&nbsp;{units.temp}</p>
            : <p>{Math.round(e.temp)}&nbsp;{units.temp}</p>
          }
        </div>
        </div>
      {expanded && <div className="infocontent">
        <p>Humidity:&nbsp;{e.humidity}%</p>
        <p>
            <Raindrop height="13px" />
            {Math.round(e.pop * 100)}%
          </p>
        {daily && <p>
            <span>Sunrise:&nbsp;{getTime(e.sunrise, "HOUR_MINUTES")}</span><br/>
            <span>Sunset:&nbsp;{getTime(e.sunset, "HOUR_MINUTES")}</span>
          </p>}
      </div>}
      <hr />
    </div>)
};

export default Infocard;