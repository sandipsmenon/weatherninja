import React from 'react';
import Titles from './components/Titles';

import './index.css';
const API_KEY = "7a4ea6e9001f672434026e5156629be3";
export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      zoom: 13,
      maptype: 'roadmap',
      place_formatted: '',
      lat:'',
      lon:'',
      place_id: '',
      place_location: '',
      temperature: undefined,
      city: undefined,
      country: undefined,
      humidity: undefined,
      description: undefined,
      futureWeather:undefined
    };
  }

  componentDidMount() {
    let map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: -33.8688, lng: 151.2195},
      zoom: 13,
      mapTypeId: 'roadmap',
    });

    map.addListener('zoom_changed', () => {
      this.setState({
        zoom: map.getZoom(),
      });
    });

    map.addListener('maptypeid_changed', () => {
      this.setState({
        maptype: map.getMapTypeId(),
      });
    });

    let marker = new window.google.maps.Marker({
      map: map,
      position: {lat: -33.8688, lng: 151.2195},
    });

    // initialize the autocomplete functionality using the #pac-input input box
    let inputNode = document.getElementById('pac-input');
    map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(inputNode);
    let autoComplete = new window.google.maps.places.Autocomplete(inputNode);

    autoComplete.addListener('place_changed', () => {
      let place = autoComplete.getPlace();
      let location = place.geometry.location;
      let lat = place.geometry.location.lat();
      let lon = place.geometry.location.lng();
      this.setState({
        place_formatted: place.formatted_address,
        place_id: place.place_id,
        place_location: location.toString(),
        lat:lat,
        lon:lon
      });

      // bring the selected place in view on the map
      map.fitBounds(place.geometry.viewport);
      map.setCenter(location);

      marker.setPlace({
        placeId: place.place_id,
        location: location,
      });

      this.getWeather(this.state.lat,this.state.lon);
      this.getFutureWeather(this.state.lat,this.state.lon);
    });
  }

    getWeather = async (x,y) => {
      //  e.preventDefault();
        const latitude = x;//e.target.elements.city.value;
        const longitude = y;//e.target.elements.country.value;
        const api_call = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
        const data = await api_call.json();
        if (latitude && longitude) {
            this.setState({
                temperature: data.main.temp,
                city: data.name,
                country: data.sys.country,
                humidity: data.main.humidity,
                description: data.weather[0].description,
                error: ""
            });
        } else {
            this.setState({
                temperature: undefined,
                city: undefined,
                country: undefined,
                humidity: undefined,
                description: undefined,
                error: "Please enter the values."
            });
        }
    }
    getFutureWeather = async (x,y) => {
        //  e.preventDefault();
        const latitude = x;//e.target.elements.city.value;
        const longitude = y;//e.target.elements.country.value;
        const api_call = await fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
        const data = await api_call.json();
		if (latitude && longitude) {
            this.setState({
                futureWeather: data.list
            });
        } else {
            this.setState({
                futureWeather: undefined
            });
        }

    }
  render() {
    return (
        <div id="app">
            <Titles/>
                <div className="main">

                        <div id='state'>

                            {
                                this.state.city && <p className="weather__key"> Location:
                                    <span className="weather__value"> {  this.state.city }, {  this.state.country }</span>
                                </p>
                            }

                            {
                                this.state.temperature && <p className="weather__key"> Temperature:
                                    <span className="weather__value"> { this.state.temperature }</span>
                                </p>
                            }
                            {
                                this.state.humidity && <p className="weather__key"> Humidity:
                                    <span className="weather__value"> { this.state.humidity } </span>
                                </p>
                            }
                            {
                                this.state.description && <p className="weather__key"> Conditions:
                                    <span className="weather__value"> { this.state.description } </span>
                                </p>
                            }
                            {
                                this.state.error && <p className="weather__error">{ this.state.error }</p>
                            }
                            {
                                this.state.city && this.state.country &&
                                <div>
                                    <br/>
                                    <br/>
                                    <br/>
                                    <br/>
                                </div>
                            }
                            {
                                this.state.futureWeather &&
                                <table className="fixed_header">
                                    <thead>
                                    <tr>
                                        <th />
                                        <th>Date</th>
                                        <th>Temp High</th>
                                        <th>Temp Low</th>
                                        <th>Condition</th>
                                        <th>Humidity</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        this.state.futureWeather.map((data, index) => {

                                            let myIcon = data.dt_txt;
                                            let count  = index+1;
                                            return (
                                                <tr key={index}>
                                                    <td >{count}</td>
                                                    <td>{myIcon}</td>
                                                    <td>{data.main.temp_max}</td>
                                                    <td>{data.main.temp_min}</td>
                                                    <td>{data.weather[0].description}</td>
                                                    <td>{data.main.humidity}</td>
                                                </tr>
                                            );
                                        })
                                    }
                                    </tbody>
                                </table>
                            }
                        </div>


                    <div id='pac-container'>
                            <input id='pac-input' type='text' placeholder='Enter a location' />
                        </div>
                    <div id='map' />

                </div>

        </div>
    );
  }
};
