import './App.css';
import React from 'react';
import axios from 'axios';
import {Weatherinfo} from './weatherinfo/Weatherinfo';
import { ReactComponent as Pentagram } from "./pentagram.svg";
import { ReactComponent as Searchbtn } from "./search.svg";

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
  // 
  const [curr_position, setCurr_position] = React.useState({});
  // the current position
  // let curr_position = {};
  // the units to display for the user (not for data fetching)
  const [units, setUnits] = React.useState({temp: '°C', wind: 'km/h'});

  const [weather, dispatchWeather] = React.useReducer(
    weatherReducer,
    {data: {}, isLoading: true, isError: false}
  );

  // async await or then?
  function getWeather (geolocation, units) {
    if (geolocation.latitude){
      axios(process.env.REACT_APP_BASE_URL + `?lat=${geolocation.latitude}&lon=${geolocation.longitude}&exclude=minutely&units=${units}&appid=${process.env.REACT_APP_WEATHER_KEY}`)
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
  };

  
// this is where the app starts when loading first
  React.useEffect(() => {
    dispatchWeather({type: 'WEATHER_FETCH_INIT'});

    // callback functions for getting position from the  browsers´ geolocation api
    const positionSuccess = position => {
      setCurr_position(position.coords);
      getWeather(curr_position, 'metric');
    };

    const positionError = error => {
      alert(`ERROR(${error.code}): ${error.message}`);
    };

    navigator.geolocation.getCurrentPosition(positionSuccess, positionError);
  }, []);

  // false is metric, true is imperial units, could be a simple variable, i know, but only works as state
  const [temptoggle, setTemptoggle] = React.useState(false);

  // units to use for api call. could be a simple variable, i know, but only works as state
  const [newUnits, setNewUnits] = React.useState('metric');

  const triggertoggle = () => {
    setTemptoggle(temptoggle => !temptoggle );
    setNewUnits(temptoggle ? ('imperial') : ('metric'));
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
    // react lint wants me to add curr_position to dependency array, but i dont want to
    //  run this effect when curr_position is updated?? sooo ?
  }, [newUnits]);

  const [city, setCity] = React.useState();
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    setDisableSearch(true)
    setCity(searchTerm);
    console.log({searchTerm})
    const spacePosition = searchTerm.lastIndexOf(' ');
    const actualSearchTerm = searchTerm.substring(0, spacePosition);
    // debugger;
    const chosenCity = suggestions.find(el => el.name === actualSearchTerm);
    setCurr_position(chosenCity.geolocation);
    console.log(curr_position);
    // let chosenCity;
    // async function chooseCity() {
      // const chosenCity = suggestions.find(el => el.name === actualSearchTerm);
      // if (chosenCity !== undefined){
        // console.log('not undefined!')
        // return chosenCity;
      // }
    // };
    
    // const chosenCity = await suggestions.find(el => el.name === actualSearchTerm);
    // let chosenCity;
    // const chooseCity = async (_callback) => {
      // chosenCity = suggestions.find(el => el.name === actualSearchTerm);
      // _callback()
    // }
    
    // console.log(newUnits, "search");
    // dispatchWeather({type: 'WEATHER_FETCH_INIT'});
    

    // chooseCity()
      // .then( chosenCity => {
        // console.log(chosenCity, "asdfasghfr")
        // if (chosenCity !== undefined){
          // curr_position = chosenCity.geolocation
          // getWeather(chosenCity.geolocation, newUnits)
        // }
        // return chosenCity;
      // })
    // setCurr_position(chosenCity.geolocation);
    // getWeather(chosenCity.geolocation, newUnits);
    
    // const setPosGetWeather = () => {
      // chooseCity(() => {
        // setCurr_position(chosenCity.geolocation);
        // getWeather(chosenCity.geolocation, newUnits);
      // })
    // }
    
    
  }

  React.useEffect(() => {
    dispatchWeather({type: 'WEATHER_FETCH_INIT'});
    getWeather(curr_position, newUnits);
  }, [curr_position])

  // the array of suggestions, to be displayed as datalist options
  const [suggestions, setSuggestions] = React.useState('');
  // dis-/enabling the search button, since i have to read the geolocation 
  // from the chosen city before making a weather request. 
  // the one call api doesn´t seem to support searching for city names.
  const [disableSearch, setDisableSearch] = React.useState(true);

  let cancelToken;

  const handleChange = (e) => {
    // only making requests if the user has typed more than three letters, to save resources
    if (e.target.value.length > 3) {
      // i have to do all this shit because datalist options do not support onclick
      // (i'm looking if the input target value matches one of the suggestions. if it does, we can click search)
      const spacePosition = e.target.value.lastIndexOf(' ');
      const inputChosenCity = e.target.value.substring(0, spacePosition);
      const cityMatch = suggestions && suggestions.filter(suggestion => suggestion.name === inputChosenCity);
      // console.log({cityMatch});
      cityMatch.length && setDisableSearch(false);

      if (cancelToken !== undefined) {
        cancelToken.cancel("aborted due to new request");
      }

      cancelToken = axios.CancelToken.source();
      setSearchTerm(e.target.value);

      axios.get(`http://localhost:8000/?query=${e.target.value}`, {cancelToken: cancelToken.token})
      .then(response => {
        console.log(response.data, "response")
        
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
            <h1>TRVE&nbsp;& KALLT</h1>
            <Searchbar disableSearch={disableSearch} handleSearch={handleSearch} handleChange={handleChange} suggestions={suggestions} />
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

const Searchbar = ({disableSearch, handleSearch, handleChange, suggestions}) => {
  console.log({disableSearch})
  return (
    <form className="searchbar" onSubmit={handleSearch}>
      <label htmlFor="city" className="citylabel" ><div className="citylabeltext" >City:</div></label>
      <input onChange={handleChange} autoComplete="off" type="text" name="cityinput" id="cityinput" list="suggestions" />
      <datalist id="suggestions">
        <>
        {/* WHY wont this show <option key="f***" value="Loading" /> */}
        {suggestions && suggestions.map((suggestion, i) => <option key={i} value={`${suggestion.name} ${suggestion.country}`} />)}
        </>
      </datalist>
      <button className="searchsubmit" disabled={ disableSearch } id="search" type="submit"><Searchbtn width="16px" /></button>
    </form>
  )
}

export default App;
