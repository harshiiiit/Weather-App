import React, { useState } from 'react';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = React.useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (event) => {
    setCity(event.target.value); //  updates the city state when the input value changes
  };

  const handleSubmit = (event) => { // fetches the weather data when the form is submitted
    event.preventDefault();


    const apiKey = 'd5d1ab8056b549f785576acd1f22a157'; // Replace with your OpenCage Geocoding API key
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(city)}&key=${apiKey}`;

    let latitude, longitude;

    // Fetch the geocoding data using the constructed URL
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.status.code === 200) {
          latitude = data.results[0].geometry.lat;
          longitude = data.results[0].geometry.lng;

          const baseUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m`;

          // Fetch weather data using the constructed URL
          fetch(baseUrl)
            .then(response => response.json())
            .then(data => {
              setWeatherData(data);
              // Handle the received weather data
              console.log(data);
            })
            .catch(error => {
              // Handle any error that occurred during the API request
              console.error('Error:', error);
              setErrorMessage('Error occurred while fetching weather data.');
            });
        } else {
          // Handle the case where the city is not found or there is an error
          console.error('City not found or API error:', data.status.message);
          setErrorMessage('Error occurred while fetching weather data.');
          // Display an error message or handle it as needed
        }
      })
      .catch(error => {
        // Handle any error that occurred during the API request
        console.error('Error:', error);
        setErrorMessage('Error occurred while fetching weather data.');
      });

  };

  const currentHour = new Date().getHours();

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');

  const formattedDate = `${year}-${month}-${day}`;

  const targetDate = formattedDate + "T" + currentHour + ":00";
  console.log(targetDate);

  return (
    <div className="App">
      <h1>Weather App</h1>
      <form onSubmit={handleSubmit}>
        <input type="text"
          placeholder="Enter city"
          value={city}
          onChange={handleChange}
        />
        <button type="Submit">Get Weather</button>
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div>
        <h2>Weather Data</h2>
        {weatherData && (
          <div>
            {targetDate && (
              <div>
                <p>Target Date: {targetDate}</p>
                {weatherData.hourly.time.includes(targetDate) ? (
                  <p>Temperature at {targetDate}: {weatherData.hourly.temperature_2m[weatherData.hourly.time.indexOf(targetDate)]}°C</p>
                ) : (
                  <p>No temperature data available for {targetDate}</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;