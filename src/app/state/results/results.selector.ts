import { createSelector } from '@ngrx/store';
import { ResultsState } from 'src/app/common/interfaces';
import { AppState } from '../app.state';

export const selectResults = (state: AppState) => state.results;
export const getResults = createSelector(
  selectResults,
  (state: ResultsState) => {
    return state && state.results;
  }
);
