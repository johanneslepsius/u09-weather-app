import React from 'react';
import {getTime, getUrl} from '../Weatherinfo';
import { ReactComponent as Arrow } from "../arrow.svg";


const Current = ({current, units}) => {
  const description = current.weather[0].description.charAt(0).toUpperCase() + current.weather[0].description.slice(1);
  const [currentweather] = current.weather;
  const [expanded, setExpanded] = React.useState(false);
return (
  <div className="card current" onClick={() => setExpanded(!expanded)}>
    <div className="infocontent">
    <p>Current: </p>
    <div className="contentgroup">
      <img className="weathericon" src={getUrl(currentweather.icon)} alt=""/>
      <p>{description}</p>
    </div>
    <div className="contentgroup">
      <p>{Math.round(current.temp)}{units.temp}</p>
      <p>Wind:&nbsp;{Math.round(current.wind_speed * 3.6)}&nbsp;{units.wind}
        <Arrow height="13px" style={{transform: `rotate(${current.wind_deg}deg`}}/>
      </p>
    </div>
    </div>
    {expanded && <div className="infocontent">
      <p>Humidity:&nbsp;{current.humidity}%</p>
      <p>
        <span>Sunrise:&nbsp;{getTime(current.sunrise, "HOUR_MINUTES")}</span><br/>
        <span>Sunset:&nbsp;{getTime(current.sunset, "HOUR_MINUTES")}</span>
      </p>
      <p>Clouds:&nbsp;{current.clouds}%</p>
    </div>}
  </div>
)
};

export default Current;