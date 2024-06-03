import React from 'react';

const DayCard = ({ reading }) => {
  return (
    <div>
      <h3>{reading.dt_txt}</h3>
      <p>Temperature: {reading.main.temp}°F</p>
      <p>Description: {reading.weather[0].description}</p>
    </div>
  );
};

export default DayCard;