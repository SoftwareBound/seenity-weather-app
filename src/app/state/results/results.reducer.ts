import { createReducer, on } from '@ngrx/store';
import { ResultsState } from 'src/app/common/interfaces';
import { getResultsAction, setSelectedResult } from './results.actions';

export const initialState: ResultsState = {
  results: [],
  selectedResult: undefined,
};

export const resultReducer = createReducer(
  initialState,
  on(getResultsAction, (state, { content }) => ({
    ...state,
    results: content,
  })),
  on(setSelectedResult, (state, { content }) => ({
    ...state,
    selectedResult: content,
  }))
);
