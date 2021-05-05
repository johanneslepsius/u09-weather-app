import React from 'react';
import Current from './current/Current';

const Weatherinfo = ({data}) => {
  return(
  <div>
    <Current current={data.current} hourly={data.hourly}></Current>
  </div>
  )
};

export default Weatherinfo;