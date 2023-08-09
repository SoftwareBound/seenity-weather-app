import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  getResults,
  getSelectedResult,
} from '../state/results/results.selector';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from '../state/app.state';
import * as moment from 'moment';
import { convertToCelsuis } from '../common/utils';
import { setSelectedResultAction } from '../state/results/results.actions';

@Component({
  selector: 'app-results-page',
  templateUrl: './results-page.component.html',
  styleUrls: ['./results-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ResultsPageComponent implements OnInit {
  chartData: any = [];
  results: any[] = [];
  selectedResult: any;
  cityResultData: any;
  nextCityIndex: number = NaN;
  prevCityIndex: number = NaN;
  isPrevCityIndex: boolean | undefined = undefined;
  isNextCityIndex: boolean | undefined = undefined;
  windData: { name: string; series: any[] } = {
    name: 'Wind Speed (m\\s)',
    series: [],
  };
  temperatureData: { name: string; series: any[] } = {
    name: 'Temperature (Celsius)',
    series: [],
  };
  humidityData: { name: string; series: any[] } = {
    name: 'Humidity (%)',
    series: [],
  };
  resultsStateSub = this.store.select(getResults).subscribe((data) => {
    this.results = data;
  });
  selecetdResultStateSub!: Subscription;
  constructor(private store: Store<AppState>) {}
  view: [number, number] = [800, 400];
  showXAxis = true;
  showYAxis = true;
  showLegend = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  xAxisLabel = 'Time';
  yAxisLabel = 'Values';

  ngOnInit(): void {
    let cityIndex;
    this.selecetdResultStateSub = this.store
      .select(getSelectedResult)
      .subscribe((data) => {
        this.selectedResult = data;
        this.cityResultData = this.results.find((city) => {
          return city.city.id === this.selectedResult.id;
        });
        if (this.cityResultData) {
          this.windData.series = this.cityResultData.list.map(
            (cityData: any) => {
              return {
                name: moment(cityData.dt_txt).format('DD MM YYYY hh:mm'),
                value: cityData.wind.speed,
              };
            }
          );
          this.temperatureData.series = this.cityResultData.list.map(
            (cityData: any) => {
              return {
                name: moment(cityData.dt_txt).format('DD MM YYYY hh:mm'),
                value: convertToCelsuis(cityData.main.temp),
              };
            }
          );
          this.humidityData.series = this.cityResultData.list.map(
            (cityData: any) => {
              return {
                name: moment(cityData.dt_txt).format('DD MM YYYY hh:mm'),
                value: cityData.main.humidity,
              };
            }
          );
        }
        this.chartData = [
          this.windData,
          this.temperatureData,
          this.humidityData,
        ];
      });
    cityIndex = this.results.findIndex(
      (result: any) => result.city.id === this.selectedResult.id
    );
    this.prevCityIndex = cityIndex > 0 ? cityIndex - 1 : -1;
    this.nextCityIndex =
      cityIndex < this.results.length - 1 ? cityIndex + 1 : this.results.length;
    this.isPrevCityIndex = !(this.prevCityIndex > 0);
    this.isNextCityIndex = !(this.nextCityIndex < this.results.length - 1);
  }

  loadPreviousResult() {
    let cityResult: any;
    if (this.cityResultData) {
      cityResult = this.results[this.prevCityIndex];
      const weatherTempartureData = convertToCelsuis(
        cityResult.list[0].main.temp
      );

      if (this.prevCityIndex !== -1) {
        this.prevCityIndex -= 1;
        this.nextCityIndex -= 1;
      }

      this.isPrevCityIndex = this.prevCityIndex === -1;
      this.isNextCityIndex = this.nextCityIndex > this.results.length - 1;
      this.store.dispatch(
        setSelectedResultAction({
          content: {
            id: cityResult.city.id,
            name: cityResult.city.name,
            country: cityResult.city.country,
            state: cityResult.city.state,
            temp: weatherTempartureData,
          },
        })
      );
    }
  }

  loadNextResult() {
    let cityResult: any;
    if (this.cityResultData) {
      cityResult = this.results[this.nextCityIndex];
      const weatherTempartureData = convertToCelsuis(
        cityResult.list[0].main.temp
      );

      if (this.nextCityIndex !== this.results.length) {
        this.prevCityIndex += 1;
        this.nextCityIndex += 1;
      }

      this.isPrevCityIndex = this.prevCityIndex < 0;
      this.isNextCityIndex = this.nextCityIndex === this.results.length;
      this.store.dispatch(
        setSelectedResultAction({
          content: {
            id: cityResult.city.id,
            name: cityResult.city.name,
            country: cityResult.city.country,
            state: cityResult.city.state,
            temp: weatherTempartureData,
          },
        })
      );
    }
  }
}
