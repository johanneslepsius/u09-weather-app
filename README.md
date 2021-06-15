# About

A simple weather app, built with React (and a teeny tiny bit of PHP), using the openweathermap API.

## Try it

1. clone the repo

2. cd into backend, run php -S localhost:8000 to spin up a local backend server

3. cd into frontend & create a .env file that contains

   - your openweathermap app id in REACT_APP_WEATHER_KEY=
   - REACT_APP_BASE_URL=https://api.openweathermap.org/data/2.5/onecall
   - REACT_APP_AUTOCOMPLETE=http://localhost:8000

4. also in frontend, open a new terminal and run npm start
