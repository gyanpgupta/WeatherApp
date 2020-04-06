import React, { Component } from 'react';
import cities from 'cities.json';

class Weather extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      weatherData: [],
    }
  }

  handleClick = identifyClick => {
    let { page } = this.state
    if (identifyClick === "next") {
      page = page + 1;
    } else {
      if (this.state.page !== 0) {
        page = page - 1;
      }
    }
    this.setState({ page });
  }

  fetchWeatherData = () => {
    const { page } = this.state
    const paginatedCities = cities.slice((page * 20), (page * 20) + 20);
    paginatedCities.forEach(city => {
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lng}&appid=3db51c79aacf7906d01567db5ae4ecfa`)
        .then(res => res.json())
        .then(data => {
          const result = [{
            cityName: data.name,
            lat: city.lat,
            lng: city.lng,
            weather: data.weather[0].description,
          }];
          this.setState({
            weatherData: [
              ...this.state.weatherData,
              ...result
            ]
          })

        })
    });
  }

  componentDidMount() {
    this.fetchWeatherData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.page !== this.state.page) {
      this.setState({ weatherData: [] });
      this.fetchWeatherData();
    }
  }

  render() {
    return (
      <div>
        <h1 className="header">Weather App</h1>
        <table className="table">
          <thead>
            <tr className="tableRow">
              <th>City Name</th>
              <th>Latitude</th>
              <th>Longitude</th>
              <th>Weather Description</th>
            </tr>
          </thead>
          <tbody>
            {this.state.weatherData && this.state.weatherData.map((data, index) => {
              return (
                <tr className="tableRow" key={index}>
                  <td>{data.cityName}</td>
                  <td>{data.lat}</td>
                  <td>{data.lng}</td>
                  <td>{data.weather}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {this.state.weatherData && <button className="previousButton" onClick={() => this.handleClick('previous')}>Prev</button>}
        {this.state.weatherData && <button className="nextButton" onClick={() => this.handleClick('next')}>Next</button>}
      </div>
    )
  }
}

export default Weather;