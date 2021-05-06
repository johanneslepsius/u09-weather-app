import React from 'react';
import {Current} from './current/Current';
import Infocard from './infocard/Infocard';

const Weatherinfo = ({data, tempformat}) => {
  const everyThirdHour = data.hourly.filter((e, i) => i % 3 === 2 && i < 24);
  return(
  <div>
    <Current current={data.current} tempformat={tempformat} />
    <Infocard data={everyThirdHour} daily={false} tempformat={tempformat} />
    <Infocard data={data.daily} daily={true} tempformat={tempformat} />
  </div>
  )
};

export default Weatherinfo;