import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';import { concatLatestFrom } from '@ngrx/operators';

import { EMPTY, forkJoin, from, of } from 'rxjs';
import { map, catchError, switchMap, mergeMap, tap } from 'rxjs/operators';
import { EntriesService } from '../services/entries.service';
import * as entriesActions from '../actions/entries.actions';
import * as progressActions from '../actions/progress.actions';
import { RatesService } from '../services/rates.service';
import { SnackBarService } from '../services/snack-bar.service';
import { DialogService } from '../services/dialog.service';
import { Store } from '@ngrx/store';
import { AppState } from '../reducers/entries.reducer';

@Injectable()
export class EntriesEffects {
    constructor(
        private actions$: Actions,
        private store: Store<AppState>,
        private entriesService: EntriesService,
        private ratesService: RatesService,
        private snackBarService: SnackBarService,
        private dialogService: DialogService,
    ) { }

    loadData$ = createEffect(() => this.actions$.pipe(
        ofType(entriesActions.loadData),
        tap(() => this.store.dispatch(progressActions.showProgress())),
        switchMap(() => forkJoin({
            entries: from(this.entriesService.getEntries()),
            currencies: from(this.ratesService.getCurrencies())
        }).pipe(
            map(({ entries, currencies }) => entriesActions.loadDataSuccess({ entries, currencies })),
            catchError(error => {
                this.snackBarService.showSnackBar(error);
                return of(entriesActions.loadDataError());
            })
        )),
        tap(() => this.store.dispatch(progressActions.hideProgress()))
    ));

    saveEntries$ = createEffect(() => this.actions$.pipe(
        ofType(entriesActions.saveEntries),
        concatLatestFrom(() => this.store.select(x => x.entriesReducer.entries)),
        switchMap(([, data]) => this.dialogService.openDialog('Save', 'All changes will be saved. Do you want to continue?').
            afterClosed().pipe(
                mergeMap(result => {
                    if (result) {
                        this.store.dispatch(progressActions.showProgress());
                        return from(this.entriesService.setEntries(data)).pipe(
                            map(() => entriesActions.saveEntriesSuccess()),
                            tap(() => this.snackBarService.showSnackBar('Saved successfully!')),
                            catchError(error => {
                                this.snackBarService.showSnackBar(error);
                                return of(entriesActions.saveEntriesError());
                            }),
                            tap(() => this.store.dispatch(progressActions.hideProgress()))
                        )
                    } else {
                        return EMPTY;
                    }
                })
            ))));

    cancelEntries$ = createEffect(() => this.actions$.pipe(
        ofType(entriesActions.cancelEntries),
        switchMap(() => this.dialogService.openDialog('Cancel', 'All changes will be reverted. Do you want to continue?').afterClosed().pipe(
            mergeMap(result => {
                if (result) {
                    return of().pipe(map(() => entriesActions.loadData()));
                } else {
                    return EMPTY;
                }
            }))
        )
    ));

    fillRates$ = createEffect(() => this.actions$.pipe(
        ofType(entriesActions.fillRates),
        tap(() => this.store.dispatch(progressActions.showProgress())),
        switchMap(action => {
            const filteredRatesKeys = action.entryRatesKeys.filter(k => k !== this.ratesService.base);
            return from(this.ratesService.getRates(action.entryDate, filteredRatesKeys)).pipe(
                map(rates => entriesActions.fillRatesSuccess({ entryDate: action.entryDate, rates })),
                catchError(error => {
                    this.snackBarService.showSnackBar(error);
                    return of(entriesActions.fillRatesError());
                }),
                tap(() => this.store.dispatch(progressActions.hideProgress()))
            );
        })
    ));
}