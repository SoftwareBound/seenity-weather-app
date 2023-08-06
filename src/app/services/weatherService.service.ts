import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private apiKey: string = '09f6900c60d7f8b99612037162773692';

  async fetchCitiesResults(city: string) {
    const apiUrl: string = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=10&appid=${this.apiKey}`;
    return await axios.get(apiUrl);
  }

  async fetchWeatherDataByCoordinates(lat: number, lon: number) {
    const apiUrl: string = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}`;
    const response = await axios.get(apiUrl);
    const responseData = response.data;
    return responseData;
  }
}
