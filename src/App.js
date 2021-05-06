import './App.css';
import React, { useState } from 'react';
import Weatherinfo from './weatherinfo/Weatherinfo';

const weatherReducer = (state, action) => {
  switch (action.type) {
    case 'WEATHER_FETCH_SUCCESS':
      return {
        ...state,
        data: action.payload,
        isLoading: false
      };
    case 'WEATHER_FETCH_INIT':
      return {
        ...state,
        isLoading: true
      };
    case 'WEATHER_FETCH_ERROR':
      return {
        ...state,
        isLoading: false,
        isError: true
      };
    default:
      throw new Error();
  }
};


function App() {

  const [weather, dispatchWeather] = React.useReducer(
    weatherReducer,
    {data: {}, isLoading: true, isError: false}
  );

  React.useEffect(() => {
    dispatchWeather({type: 'WEATHER_FETCH_INIT'});

    const positionSuccess = position => {
      getWeather(position.coords);
    };

    const positionError = error => {
      alert(`ERROR(${error.code}): ${error.message}`);
    };

    navigator.geolocation.getCurrentPosition(positionSuccess, positionError);
      
    function getWeather({latitude, longitude}) {
      fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely&units=metric&appid=${process.env.REACT_APP_WEATHER_KEY}`)
        .then(response => response.json())
        .then(result => {
          console.log(result);
          dispatchWeather({
            type: 'WEATHER_FETCH_SUCCESS',
            isLoading: false,
            payload: result
          })
        })
        .catch(() => 
          dispatchWeather({type: 'WEATHER_FETCH_ERROR'})
        );
      /*
      exclude:
    current
    minutely
    hourly
    daily
    alerts
*/
    }
  }, []);

  const [temptoggle, settemptoggle] = React.useState(false);

  const triggertoggle = () => {
    settemptoggle( !temptoggle );
    console.log(temptoggle)
  }

  return (
    <>
    {weather.isError && <p>Something went wrong... Please try again later!</p>}
    {weather.isLoading ? (
      <p>Loading...</p>
      ) : (
        <>
      <Unittoggle onToggle={triggertoggle} temptoggle={temptoggle}/>
      <Weatherinfo data={weather.data}></Weatherinfo>
      </>
      )}
    </>
  );
}

const Unittoggle = ({onToggle, temptoggle}) => {
  return(
        <div onClick={onToggle} className={`temp-toggle ${temptoggle ? 'temp-toggle--checked' : ''}`}>
            <div className="temp-toggle-container">
                <div className="temp-toggle-check">
                    <span>°F</span>
                </div>
                <div className="temp-toggle-uncheck">
                    <span>°C</span>
                </div>
            </div>
            <div className="temp-toggle-circle"></div>
            {/* <input className="temp-toggle-input" type="checkbox" aria-label="Toggle Button" /> */}
        </div>
    )
}

export default App;
