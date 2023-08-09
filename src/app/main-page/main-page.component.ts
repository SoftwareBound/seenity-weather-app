import { Component, OnInit, OnDestroy } from '@angular/core';
import { WeatherService } from '../services/weatherService.service';
import { SortTypes } from '../common/enums';
import { convertToCelsuis, sortBy } from '../common/utils';
import { Store } from '@ngrx/store';
import {
  getResultsAction,
  setSelectedResultAction,
} from '../state/results/results.actions';
import { getResults } from '../state/results/results.selector';
import { AppState } from '../state/app.state';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit, OnDestroy {
  cityName: string = '';
  sortTypes = SortTypes;
  previousSearches: string[] = [];
  cityResultsWeather: any[] = [];
  cityResultsWeatherData: any[] = [];

  constructor(
    private weatherService: WeatherService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    const previousSearches = JSON.parse(
      localStorage.getItem('searches') as string
    );
    if (previousSearches) {
      this.previousSearches = previousSearches;
    }
    window.onbeforeunload = () => this.ngOnDestroy();
  }
  searchFromHistory(cityName: string) {
    this.cityName = cityName;
    this.searchWeatherForCity(true);
  }

  async searchWeatherForCity(fromSearch?: boolean) {
    if (
      this.cityName === '' ||
      this.cityName === undefined ||
      this.cityName === null
    ) {
      window.alert(`Please enter a valid search`);
      return;
    }
    if (this.cityResultsWeatherData.length) {
      this.cityResultsWeatherData = [];
    }
    if (!fromSearch) {
      this.previousSearches.push(this.cityName);
    }

    let cityResults = await this.weatherService.fetchCitiesResults(
      this.cityName
    );
    let cityResultsData: any[] = cityResults;
    this.cityResultsWeather = await Promise.all(
      cityResultsData.map(async (city) => {
        let weatherData =
          await this.weatherService.fetchWeatherDataByCoordinates(
            city.lat,
            city.lon
          );
        weatherData.city.state = city.state;
        this.cityResultsWeatherData.push(weatherData);
        let weatherTempartureData = convertToCelsuis(
          weatherData.list[0].main.temp
        ).toFixed(0);
        return {
          id: weatherData.city.id,
          name: city.name,
          state: city.state,
          country: city.country,
          temp: weatherTempartureData,
        };
      })
    );

    this.store.dispatch(
      getResultsAction({ content: this.cityResultsWeatherData })
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

  setSelectedResult(e: any) {
    this.store.dispatch(setSelectedResultAction({ content: e }));
  }

  ngOnDestroy(): void {
    localStorage.setItem('searches', JSON.stringify(this.previousSearches));
  }
}
