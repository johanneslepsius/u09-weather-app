import React from 'react';
import './Weatherinfo.css';
import Current from './current/Current';
import Infocard from './infocard/Infocard';

const getTime = (unixTime, type) => {
  const date = new Date(unixTime * 1000);
  switch (type){
  case "HOUR":
    return date.getHours() + ":00";
  case "HOUR_MINUTES":
    return `${date.getHours()}:${date.getMinutes()}`;
  case "DAY":
    return new Intl.DateTimeFormat('en-US', { weekday: 'long'}).format(date);
  default:
    throw new Error();
  };
};


const getUrl = id => (`http://openweathermap.org/img/wn/${id}.png`);

const Weatherinfo = ({data, units}) => {
  console.log(data)
  const everyThirdHour = data.hourly.filter((e, i) => i % 3 === 2 && i < 24);
  return(
  <main>
    <div id="content">
      <Current current={data.current} units={units} />
      <Infocard key={'hours'} data={everyThirdHour} daily={false} units={units} />
      <Infocard key={'days'} data={data.daily} daily={true} units={units} />
    </div>
  </main>
  )
};

export {Weatherinfo, getTime, getUrl};