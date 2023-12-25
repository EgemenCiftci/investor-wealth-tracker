import { Component, OnDestroy, OnInit } from '@angular/core';
import { AssetTypes } from '../../enums/asset-types';
import { DebtTypes } from '../../enums/debt-types';
import { Currency } from '../../models/currency';
import { Entry } from '../../models/entry';
import { RatesService } from '../../services/rates.service';
import { Store } from '@ngrx/store';
import { addEntry, copyAndAddEntry, removeEntry, fillRates, saveEntries, addAsset, addDebt, removeAsset, removeDebt, cancelEntries, setRate, loadData, filterCurrencies } from 'src/app/actions/entries.actions';
import { Observable, Subject, map } from 'rxjs';
import { AppState } from 'src/app/reducers/entries.reducer';

@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.css']
})
export class EntriesComponent implements OnInit, OnDestroy {
  entries$ = this.store.select(x => x.entriesReducer.entries);
  isBusy$ = this.store.select(x => x.progressReducer.isBusy);
  currencies$ = this.store.select(x => x.entriesReducer.currencies);
  filteredCurrencies$ = this.store.select(x => x.entriesReducer.filteredCurrencies);
  assetTypes = Object.entries(AssetTypes);
  debtTypes = Object.entries(DebtTypes);
  private _unsubscribe$ = new Subject<void>();

  constructor(
    public ratesService: RatesService, 
    private store: Store<AppState>) {
  }

  ngOnInit() {
    this.store.dispatch(loadData());
  }

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

  filter(event: any) {
    const value = event.target.value;
    this.store.dispatch(filterCurrencies({ value }));
  }

  save() {
    this.store.dispatch(saveEntries());
  }

  cancel() {
    this.store.dispatch(cancelEntries());
  }

  addEntry() {
    this.store.dispatch(addEntry({ base: this.ratesService.base }));
  }

  copyAndAddEntry(entry: Entry) {
    this.store.dispatch(copyAndAddEntry({ entryDate: entry.date }));
  }

  addAsset(entry: Entry) {
    this.store.dispatch(addAsset({ entryDate: entry.date, base: this.ratesService.base }));
  }

  addDebt(entry: Entry) {
    this.store.dispatch(addDebt({ entryDate: entry.date, base: this.ratesService.base }));
  }

  removeEntry(entry: Entry) {
      this.store.dispatch(removeEntry({ entryDate: entry.date }));
  }

  removeAsset(entry: Entry, assetIndex: number) {
    this.store.dispatch(removeAsset({ entryDate: entry.date, assetIndex, base: this.ratesService.base }));
  }

  removeDebt(entry: Entry, debtIndex: number) {
    this.store.dispatch(removeDebt({ entryDate: entry.date, debtIndex, base: this.ratesService.base }));
  }

  fillRates(entry: Entry) {
    this.store.dispatch(fillRates({ entryDate: entry.date, entryRatesKeys: Object.keys(entry.rates) }));
  }

  getCurrency(code: string): Observable<Currency> {
    return this.currencies$.pipe(map(currencies => currencies.find(currency => currency.code === code) ?? new Currency(code, '')));
  }

  setRate(entry: Entry, key: string, event: Event) {
    this.store.dispatch(setRate({ entryDate: entry.date, rateKey: key, rateValue: (event.target as any).value }));
  }
}
