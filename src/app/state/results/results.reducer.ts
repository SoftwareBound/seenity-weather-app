import { createReducer, on } from '@ngrx/store';
import { ResultsState } from 'src/app/common/interfaces';
import { getResultsAction, setSelectedResultAction } from './results.actions';

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
  on(setSelectedResultAction, (state, { content }) => ({
    ...state,
    selectedResult: content,
  }))
);
