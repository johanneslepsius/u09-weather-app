import React from 'react';
import {getTime, getUrl} from '../Weatherinfo';
import { ReactComponent as Raindrop } from "../raindrop.svg";
import { ReactComponent as Arrow } from "../arrow.svg";


const Infocard = ({data, daily, units}) => {
  const [expanded, setExpanded] = React.useState(false);
return (
  <>
    <button type="button" onClick={() => setExpanded(!expanded)}>{expanded ? "Minimize" : "Expand"}</button>
    <div className="card">
    {data.map(e => 
      <Infoitem 
        key={e.dt} 
        e={e} 
        daily={daily} 
        units={units} 
        expanded={expanded}
      />
      )}
      </div>
  </>
);
};

const Infoitem = ({e, daily, units, expanded}) => {
  const description = e.weather[0].description.charAt(0).toUpperCase() + e.weather[0].description.slice(1);
  return (
    <div className="infoitem">
      <div className="infocontent">
        {daily ? (
          <div className="contentgroup">
            <p><b>{getTime(e.dt, "DAY")}</b></p>
            <p>{`${Math.round(e.temp.min)} - ${Math.round(e.temp.max)}`}&nbsp;{units.temp}</p>
          </div>
        ):(
          <div className="contentgroup">
            <p><b>{getTime(e.dt, "HOUR")}</b></p>
            <p>{Math.round(e.temp)}&nbsp;{units.temp}</p>
          </div>
        )}
        <div className="contentgroup">
          <img className="weathericon" src={getUrl(e.weather[0].icon)} alt=""/>
          <p key={e.weather[0].id}>{description}</p>
        </div>
        <div className="contentgroup">
          <p>Wind:&nbsp;{Math.round(e.wind_speed * 3.6)}&nbsp;{units.wind}<Arrow height="13px" style={{transform: `rotate(${e.wind_deg}deg`}}/></p>
          <p><Raindrop height="13px" />{Math.round(e.pop * 100)}%</p>
        </div>
        </div>
      {expanded && <div className="infocontent">
        <p>Humidity:&nbsp;{e.humidity}%</p>
        {daily && <p>
            <span>Sunrise:&nbsp;{getTime(e.sunrise, "HOUR_MINUTES")}</span><br/>
            <span>Sunset:&nbsp;{getTime(e.sunset, "HOUR_MINUTES")}</span>
          </p>}
      </div>}
    </div>)
};

export default Infocard;