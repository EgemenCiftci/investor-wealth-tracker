import { createReducer, on } from '@ngrx/store';
import { hideProgress, showProgress } from '../actions/progress.actions';

export interface ProgressState {
    isBusy: boolean
}

export const initialState: ProgressState = { isBusy: false };

export const progressReducer = createReducer(
    initialState,
    on(showProgress, _state => ({ isBusy: true })),
    on(hideProgress, _state => ({ isBusy: false }))
);