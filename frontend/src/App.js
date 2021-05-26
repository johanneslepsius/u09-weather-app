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

  function getWeather (geolocation, units) {
    if (geolocation.latitude){
      axios(`https://api.openweathermap.org/data/2.5/onecall?lat=${geolocation.latitude}&lon=${geolocation.longitude}&exclude=minutely&units=${units}&appid=${process.env.REACT_APP_WEATHER_KEY}`)
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
      };
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

  const [temptoggle, setTemptoggle] = React.useState(false);
  // const [temptoggle, toggleTemp] = React.useReducer(previousTemp => !previousTemp, false)
  const [newUnits, setNewUnits] = React.useState('metric');

  const triggertoggle = () => {
    setTemptoggle(temptoggle => !temptoggle );
  }

  React.useEffect(() => {
    setNewUnits(temptoggle ? ('imperial') : ('metric'));
  }, [temptoggle]);

  React.useEffect(() => {
    if (newUnits === 'metric') {
      setUnits({temp: '°C', wind: 'km/h'});
    } else if (newUnits === 'imperial') {
      setUnits({temp: '°F', wind: 'mph'});
    };
    dispatchWeather({type: 'WEATHER_FETCH_INIT'});
    getWeather(curr_position, newUnits);
  }, [newUnits]);

  const [city, setCity] = React.useState();

  const handleSearch = (event) => {
    event.preventDefault();
    const spacePosition = searchTerm.indexOf(' ');
    const actualSearchTerm = searchTerm.substring(0, spacePosition);
    setCity(searchTerm);
    const chosenCity = suggestions.find(el => el.name === actualSearchTerm);
    console.log(newUnits, "search");
    dispatchWeather({type: 'WEATHER_FETCH_INIT'});
    setCurr_position(chosenCity.geolocation);
    getWeather(chosenCity.geolocation, newUnits);
  }

  const [suggestions, setSuggestions] = React.useState('');
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleChange = (event) => {
    if (event.target.value.length > 3) {
      axios.get(`http://localhost:8000/?query=${event.target.value}`)
      .then(response => {
        console.log(response.data);
        setSearchTerm(event.target.value);
        if (response.data.length) {
          setSuggestions(response.data);
        }
        })
      .catch(error => console.log(error))
    }
  }

  return (
    <div className="bg-img">
      <div className="bg-overlay">
        <div className="header-bg">
          <header>
            <h1>TRVE & KALLT</h1>
            <Searchbar handleSearch={handleSearch} handleChange={handleChange} suggestions={suggestions} />
            <div className="toggle">Metric / Imperial: 
              <Unittoggle onToggle={triggertoggle} temptoggle={temptoggle}/>
            </div>
          </header>
        </div>
        {weather.isError && <p>Something went wrong... Please try again later!</p>}
        {weather.isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
          {city && <h2>Weather in {city}</h2>}
          <Weatherinfo data={weather.data} units={units}/>
          </>
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

const Searchbar = ({handleSearch, handleChange, suggestions}) => {
  return (
    <form onSubmit={handleSearch}>
      <label htmlFor="city">City:</label>
      <input onChange={handleChange} autoComplete="off" type="text" name="cityinput" id="cityinput" list="suggestions" />
      <datalist id="suggestions">
        <>
        {suggestions && suggestions.map((suggestion, i) => <option key={i} value={`${suggestion.name} (${suggestion.country})`} />)}
        </>
      </datalist>
      <button id="search" type="submit">Search</button>
    </form>
  )
}

export default App;