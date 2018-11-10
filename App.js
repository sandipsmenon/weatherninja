import React from 'react';
import Weather from "./components/Weather";
import './index.css';
const API_KEY = "7a4ea6e9001f672434026e5156629be3";
export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      zoom: 13,
      maptype: 'roadmap',
      place_formatted: '',
      place_id: '',
      place_location: '',
      temperature: undefined,
      city: undefined,
      country: undefined,
      humidity: undefined,
      description: undefined
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

      this.setState({
        place_formatted: place.formatted_address,
        place_id: place.place_id,
        place_location: location.toString(),
      });

      // bring the selected place in view on the map
      map.fitBounds(place.geometry.viewport);
      map.setCenter(location);

      marker.setPlace({
        placeId: place.place_id,
        location: location,
      });

      this.getWeather(this.state.place_formatted);
    });
  }

    getWeather = async (x) => {
      //  e.preventDefault();
        const city = x;//e.target.elements.city.value;
        const country = 'india';//e.target.elements.country.value;
        const api_call = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await api_call.json();
        if (city && country) {
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
  render() {
    return (
      <div id='app'>
	  <div id='state'>
	  <p>Place: {this.state.place_formatted}</p>
<p>Place ID: {this.state.place_id}</p>
<p>Location: {this.state.place_location}</p>
  <h1>State</h1>
  <p>
    Zoom level: {this.state.zoom}<br />
    Map type: {this.state.maptype}
  </p>
</div>
          <Weather
              temperature={this.state.temperature}
              humidity={this.state.humidity}
              city={this.state.city}
              country={this.state.country}
              description={this.state.description}
              error={this.state.error}
          />
<div id='pac-container'>
  <input id='pac-input' type='text' placeholder='Enter a location' />
</div>
        <div id='map' />
      </div>
    );
  }
};
