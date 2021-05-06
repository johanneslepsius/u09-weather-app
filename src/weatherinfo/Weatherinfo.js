import React from 'react';
import {Current} from './current/Current';
import Infocard from './infocard/Infocard';

const Weatherinfo = ({data, units}) => {
  console.log(data)
  const everyThirdHour = data.hourly.filter((e, i) => i % 3 === 2 && i < 24);
  return(
  <div>
    <Current current={data.current} units={units} />
    <Infocard key={'hours'} data={everyThirdHour} daily={false} units={units} />
    <Infocard key={'days'} data={data.daily} daily={true} units={units} />
  </div>
  )
};

export default Weatherinfo;