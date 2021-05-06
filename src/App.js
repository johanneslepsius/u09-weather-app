import './App.css';
import React from 'react';
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

  function getWeather({latitude, longitude}, units) {
      fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely&units=${units}&appid=${process.env.REACT_APP_WEATHER_KEY}`)
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

  const [curr_position, setCurr_position] = React.useState({});

  const [units, setUnits] = React.useState({temp: '°C', wind: 'km/h'})

  const [weather, dispatchWeather] = React.useReducer(
    weatherReducer,
    {data: {}, isLoading: true, isError: false}
  );

  React.useEffect(() => {
    dispatchWeather({type: 'WEATHER_FETCH_INIT'});

    const positionSuccess = position => {
      setCurr_position(position.coords);
      getWeather(position.coords, 'metric');
    };

    const positionError = error => {
      alert(`ERROR(${error.code}): ${error.message}`);
    };

    navigator.geolocation.getCurrentPosition(positionSuccess, positionError);
  }, []);

  const [temptoggle, settemptoggle] = React.useState(false);

  const triggertoggle = () => {
    settemptoggle( !temptoggle );
    const newUnits = temptoggle ? ('metric') : ('imperial');
    if (newUnits === 'metric') {
      setUnits({temp: '°C', wind: 'km/h'});
    } else if (newUnits === 'imperial') {
      setUnits({temp: '°F', wind: 'mph'});
    }
    
    getWeather(curr_position, newUnits);
  }

  return (
    <>
    {weather.isError && <p>Something went wrong... Please try again later!</p>}
    {weather.isLoading ? (
      <p>Loading...</p>
      ) : (
        <>
      <Unittoggle onToggle={triggertoggle} temptoggle={temptoggle}/>
      <Weatherinfo data={weather.data} units={units}/>
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
