import React from 'react';
import {getTime, getUrl} from '../Weatherinfo';
import { ReactComponent as Raindrop } from "../raindrop.svg";


const Infocard = ({data, daily, units}) => {
return (
    <div>
    {data.map(e => 
      <Infoitem key={e.dt} e={e} daily={daily} units={units}/>
      )}
      </div>
);
};

const Infoitem = ({e, daily, units}) => {
  const description = e.weather[0].description.charAt(0).toUpperCase() + e.weather[0].description.slice(1);
  const [expanded, setExpanded] = React.useState(false);
  return (
    <>
      <div onClick={() => setExpanded(!expanded)}>
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
        <p key={e.weather[0].id}>{description}</p>
        <p>Wind: {Math.round(e.wind_speed * 3.6)} {units.wind}</p>
        <p><Raindrop height="13px" /> {e.pop * 100}%</p>
      </div>
      {expanded && <div>
        HELLoooooo
      </div>}
    </>)
};

export default Infocard;