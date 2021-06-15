# About

A simple weather app, built with React (and a teeny tiny bit of PHP), using the openweathermap API.
I made this for a good friend of mine, a metalhead and master of puns who gave me the ideas for this theme.
(He describes his music as true and cult, therefore the name - true and kallt)

## Try it

1. clone the repo

2. cd into backend, run `php -S localhost:8000` to spin up a local backend server

3. cd into frontend & create a .env file that contains

   - REACT_APP_WEATHER_KEY={your openweathermap app id}
   - REACT_APP_BASE_URL=https://api.openweathermap.org/data/2.5/onecall

4. also in frontend, open a new terminal and run 
`npm install`, and when that is done, `npm start`
