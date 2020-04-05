import React from 'react';
import cities from 'cities.json';
import './Weather.css';

class DisplayWeather extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      arr: [],
    }
  }

  handleClick = identifyClick => {
    if (identifyClick === "next") {
      const count = this.state.page + 21;
      this.setState({ page: count });
    } else {
      if (this.state.page !== 0) {
        const count = this.state.page - 21;
        this.setState(({ page: count }));
      }
    }
  }

  fetchData = () => {
    const paginatedCities = cities.slice(this.state.page, this.state.page + 21);
    paginatedCities.forEach(obj => {
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${obj.lat}&lon=${obj.lng}&appid=3db51c79aacf7906d01567db5ae4ecfa`)
        .then(res => res.json())
        .then(data => {
          const result = [{
            cityName: data.name,
            lat: obj.lat,
            lng: obj.lng,
            weather: data.weather[0].description,
          }];
          this.setState({
            arr: [
              ...this.state.arr,
              ...result
            ]
          })

        })
    });
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.page !== this.state.page) {
      this.setState({ arr: [] });
      this.fetchData();
    }
  }

  render() {
    return (
      <div>
        <h1 className="header">Weather App</h1>
        <table className="table">
          <thead>
            <tr className="tableRow">
              <th className="tableHeader">City Name</th>
              <th className="tableHeader">Latitude</th>
              <th className="tableHeader">Longitude</th>
              <th className="tableHeader">Weather Description</th>
            </tr>
          </thead>
          <tbody>
            {this.state.arr && this.state.arr.map((weatherData,index) => {
              return (
                <tr className="tableRow" key={index}>
                  <td className="tableHeader">{weatherData.cityName}</td>
                  <td className="tableHeader">{weatherData.lat}</td>
                  <td className="tableHeader">{weatherData.lng}</td>
                  <td className="tableHeader">{weatherData.weather}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <button className="previousButton" onClick={() => this.handleClick('previous')}>Prev</button>
        <button className="nextButton" onClick={() => this.handleClick('next')}>Next</button>
      </div>
    )
  }
}

export default DisplayWeather;