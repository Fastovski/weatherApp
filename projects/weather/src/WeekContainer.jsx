import React from 'react';
import apiConfig from './apiKeys';
import DayCard from './DayCard';
import './index.html'

class WeekContainer extends React.Component {
  state = {
    fullData: [],
    dailyData: []
  }

  componentDidMount = () => {
    const weatherURL =
    `http://api.openweathermap.org/data/2.5/forecast?lat=53.9&lon=27.6&appid=${apiConfig.owmKey}`

    fetch(weatherURL)
    .then(res => res.json())
    .then(data => {
      if (data.list) {
        const dailyData = data.list.filter(reading => reading.dt_txt.includes("18:00:00"))
        this.setState({
          fullData: data.list,
          dailyData: dailyData
        }, () => console.log(this.state))
      } else {
        console.error('Error: data.list is undefined');
      }
    })
    .catch(error => {
      console.error('Error fetching weather data:', error);
    });
  }

  formatDayCards = () => {
    return this.state.dailyData.map((reading, index) => {
      const tempInCelsius = reading.main.temp - 273.15;
      const tempInFahrenheit = (tempInCelsius * 9/5) + 32;
      return <DayCard reading={{...reading, main: {...reading.main, temp: tempInFahrenheit}}} key={index} />
    })
  }

  render() {
    return (
      <div className="container">
      <h1 className="display-1 jumbotron">5-Day Forecast.</h1>
      <h2 className="display-5 text-muted">Minsk, Belarus</h2>
        <div className="row justify-content-center">

          {this.formatDayCards()}

        </div>
      </div>
    )
  }
}

export default WeekContainer;