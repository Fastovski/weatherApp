import React, { useEffect } from 'react';
import apiConfig from './apiKeys';
import DayCard from './DayCard';

const WeekContainer = () => {
  const [fullData, setFullData] = React.useState([]);
  const [dailyData, setDailyData] = React.useState([]);

  useEffect(() => {
    // Add jQuery
    const jQueryScript = document.createElement('script');
    jQueryScript.src = 'https://code.jquery.com/jquery-3.3.1.slim.min.js';
    jQueryScript.integrity = 'sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo';
    jQueryScript.crossOrigin = 'anonymous';
    document.body.appendChild(jQueryScript);

    jQueryScript.onload = () => {
      // Add Bootstrap JS only after jQuery has been loaded
      const bootstrapScript = document.createElement('script');
      bootstrapScript.src = 'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js';
      bootstrapScript.integrity = 'sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM';
      bootstrapScript.crossOrigin = 'anonymous';
      document.body.appendChild(bootstrapScript);
    };

    // Add Bootstrap CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css';
    link.integrity = 'sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);

    const weatherURL = `http://api.openweathermap.org/data/2.5/forecast?lat=53.9&lon=27.6&lang=ru&appid=${apiConfig.owmKey}`;

    fetch(weatherURL)
      .then(res => res.json())
      .then(data => {
        if (data.list) {
          const dailyData = data.list.filter(reading => reading.dt_txt.includes("18:00:00"));
          setFullData(data.list);
          setDailyData(dailyData);
        } else {
          console.error('Error: data.list is undefined');
        }
      })
      .catch(error => {
        console.error('Error fetching weather data:', error);
      });

    return () => {
      document.head.removeChild(link);
      document.body.removeChild(jQueryScript);
    };
  }, []);

  const formatDayCards = () => {
    return dailyData.map((reading, index) => {
      const tempInCelsius = reading.main.temp - 273.15;
      const tempInFahrenheit = (tempInCelsius * 9/5) + 32;
      return <DayCard reading={{...reading, main: {...reading.main, temp: tempInFahrenheit}}} key={index} />;
    });
  };

  return (
    <div className="container">
      <h1 className="display-1 jumbotron">5-Day Forecast</h1>
      <h2 className="display-5 text-muted">Minsk, Belarus</h2>
      <div className="row justify-content-center">
        {formatDayCards()}
      </div>
    </div>
  );
};

export default WeekContainer;
