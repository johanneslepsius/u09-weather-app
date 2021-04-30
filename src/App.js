import './App.css';
import React from 'react';

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
    dispatchWeather({type: 'WEATHER_FETCH_INIT'})
    const positionSuccess = position => {
      getWeather(position.coords);
    };

    const positionError = error => {
      alert(`ERROR(${error.code}): ${error.message}`);
    };

    navigator.geolocation.getCurrentPosition(positionSuccess, positionError);
      
    function getWeather({latitude, longitude}) {
      fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely&appid=${process.env.REACT_APP_WEATHER_KEY}`)
        .then(response => response.json())
        .then(result => {
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

  return (
    <>
    {weather.isError && <p>Something went wrong...</p>}
    {weather.isLoading ? (
      <p>Loading...</p>
      ) : (
      <Weatherinfo data={weather.data}></Weatherinfo>
      )}
    </>
  );
}

const Weatherinfo = (data) => {
  
  return(
  <div>
    <Current current={data.current}></Current>
  </div>
  )
};

const Current = (current) => {
  // console.log(current);
return (
  <div>
    {current.weather.map((item) => <p>{item.main}: {item.description}</p>)}
  </div>
)
};

export default App;
