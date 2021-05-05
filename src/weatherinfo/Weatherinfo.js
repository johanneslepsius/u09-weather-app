import React from 'react';
import {Current} from './current/Current';
import Infocard from './infocard/Infocard';

const Weatherinfo = ({data}) => {
  const everyThirdHour = data.hourly.filter((e, i) => i % 3 === 2 && i < 24);
  console.log(data)
  return(
  <div>
    <Current current={data.current} />
    <Infocard data={everyThirdHour} daily={false}/>
    <Infocard data={data.daily} daily={true}></Infocard>
  </div>
  )
};

export default Weatherinfo;