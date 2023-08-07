import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../services/weatherService.service';
import { SortTypes } from '../common/enums';
import { convertToCelsuis, sortBy } from '../common/utils';
import { Store } from '@ngrx/store';
import { getResultsAction } from '../state/results/results.actions';
import { getResults } from '../state/results/results.selector';
import { AppState } from '../state/app.state';

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
  public resultsState = this.store
    .select(getResults)
    .subscribe((data) => console.log(data));

  constructor(
    private weatherService: WeatherService,
    private store: Store<AppState>
  ) {}

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
    this.store.dispatch(getResultsAction({ content: this.cityResultsWeather }));
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
