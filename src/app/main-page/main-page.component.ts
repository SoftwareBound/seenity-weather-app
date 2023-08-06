import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../services/weatherService.service';
import { SortTypes } from '../common/enums';
import { convertToCelsuis, sortBy } from '../common/utils';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
  cityName: string = '';
  sortTypes = SortTypes;

  previousSearches: string[] = [];
  cityResultsWeather: any[] = [];

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {}

  async searchWeatherForCity() {
    const cityResults = await this.weatherService.fetchCitiesResults(
      this.cityName
    );
    const cityResultsData: any[] = cityResults.data;
    this.cityResultsWeather = await Promise.all(
      cityResultsData.map(async (city) => {
        const weatherData =
          await this.weatherService.fetchWeatherDataByCoordinates(
            city.lat,
            city.lon
          );
        const weatherTempartureData = convertToCelsuis(
          weatherData.list[0].main.temp
        ).toFixed(0);
        return {
          name: city.name,
          country: city.country,
          temp: weatherTempartureData,
        };
      })
    );
  }

  sortResultstBy(e: any) {
    const sortType: string = e.target.innerText;
    switch (sortType) {
      case SortTypes.BY_NAME_ASCENDING:
        sortBy(true, 'name', this.cityResultsWeather);
        break;
      case SortTypes.BY_NAME_DESCENDING:
        sortBy(false, 'temp', this.cityResultsWeather);
        break;
      case SortTypes.BY_TEMP_ASCENDING:
        sortBy(true, 'temp', this.cityResultsWeather);
        break;
      case SortTypes.BY_TEMP_DESCENDING:
        sortBy(false, 'temp', this.cityResultsWeather);
        break;
    }
  }
}
