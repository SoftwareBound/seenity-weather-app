import { createAction, props } from '@ngrx/store';
import { Result } from 'src/app/common/types';

export const getResultsAction = createAction(
  'SET_RESULTS',
  props<{ content: any[] }>()
);

export const setSelectedResult = createAction(
  'SET_SELECTED_RESULT',
  props<{ content: Result }>()
);
