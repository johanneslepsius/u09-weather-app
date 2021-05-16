import './App.css';
import React from 'react';
import axios from 'axios';
import {Weatherinfo} from './weatherinfo/Weatherinfo';
import { ReactComponent as Pentagram } from "./pentagram.svg";

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

  function getWeather (position, units) {
      axios(`https://api.openweathermap.org/data/2.5/onecall?lat=${position.latitude}&lon=${position.longitude}&exclude=minutely&units=${units}&appid=${process.env.REACT_APP_WEATHER_KEY}`)
      .then(result => {
          dispatchWeather({
            type: 'WEATHER_FETCH_SUCCESS',
            isLoading: false,
            payload: result.data
          })
        })
        .catch(() => 
          dispatchWeather({type: 'WEATHER_FETCH_ERROR'})
        );
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
    // this or useeffect with temptoggle dependency?
    dispatchWeather({type: 'WEATHER_FETCH_INIT'});
    getWeather(curr_position, newUnits);
  }

  const handleSearch = (event) => {
    console.log(event)
  }

  return (
    <div className="bg-img">
      <div className="bg-overlay">
        <div className="header-bg">
          <header>
            <h1>TRVE & KALLT</h1>
              <Searchbar handleSearch={handleSearch}/>
            <div className="toggle">Imperial / Metric: 
              <Unittoggle onToggle={triggertoggle} temptoggle={temptoggle}/>
            </div>
          </header>
        </div>
        {weather.isError && <p>Something went wrong... Please try again later!</p>}
        {weather.isLoading ? (
          <p>Loading...</p>
        ) : (
          <Weatherinfo data={weather.data} units={units}/>
        )}
        <footer>
          <p>True and kallt is a parody on how Black Metal-Heads describe their music as "true and cult".</p>
        </footer>
      </div>
    </div>
  );
}

const Unittoggle = ({onToggle, temptoggle}) => {
  return (
        <div onClick={onToggle} className={`temp-toggle ${temptoggle ? 'temp-toggle--checked' : ''}`}>
            <div className="temp-toggle-container">
                <div className="temp-toggle-check">
                    <span><b>°F</b></span>
                </div>
                <div className="temp-toggle-uncheck">
                    <span><b>°C</b></span>
                </div>
            </div>
            <div className="temp-toggle-circle"><Pentagram /></div>
            {/* <input className="temp-toggle-input" type="checkbox" aria-label="Toggle Button" /> */}
        </div>
    )
}

const Searchbar = ({handleSearch}) => {
  return (
    <form onSubmit={handleSearch}>
      <label htmlFor="city">City:</label>
      <input type="text" name="cityinput" id="cityinput" />
      <button id="search" type="submit">Search</button>
    </form>
  )
}

export default App;
