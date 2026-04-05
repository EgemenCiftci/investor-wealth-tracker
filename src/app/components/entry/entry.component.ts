import { Component, inject, Input } from '@angular/core';
import { Entry } from '../../models/entry';
import { MatExpansionPanel, MatExpansionPanelDescription, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { AsyncPipe, CurrencyPipe, DatePipe, KeyValuePipe } from '@angular/common';
import { MatAutocompleteTrigger, MatAutocomplete } from '@angular/material/autocomplete';
import { MatSelect, MatOption } from '@angular/material/select';
import { CamelCaseToSpacesPipe } from '../../pipes/camel-case-to-spaces.pipe';
import { TotalPipe } from '../../pipes/total.pipe';
import { FormsModule } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { copyAndAddEntry, addAsset, addDebt, removeEntry, removeAsset, removeDebt, fillRates, setRate, setDate, setAsset, setDebt, filterCurrencies } from '../../actions/entries.actions';
import { Currency } from '../../models/currency';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers/entries.reducer';
import { RatesService } from '../../services/rates.service';
import { AssetTypes } from '../../enums/asset-types';
import { DebtTypes } from '../../enums/debt-types';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-entry',
  imports: [
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatExpansionPanelDescription,
    MatFormField,
    MatLabel,
    MatInput,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatSuffix,
    MatDatepicker,
    MatSelect,
    MatOption,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatButton,
    MatIcon,
    CurrencyPipe,
    DatePipe,
    KeyValuePipe,
    CamelCaseToSpacesPipe,
    TotalPipe,
    FormsModule,
    AsyncPipe
  ],
  templateUrl: './entry.component.html',
  styleUrl: './entry.component.css',
})
export class EntryComponent {
  @Input() entry!: Entry;
  ratesService = inject(RatesService);
  private readonly store = inject<Store<AppState>>(Store);
  currencies$ = this.store.select(x => x.entriesReducer.currencies);
  filteredCurrencies$ = this.store.select(x => x.entriesReducer.filteredCurrencies);
  assetTypes = Object.entries(AssetTypes);
  debtTypes = Object.entries(DebtTypes);
  trackByFn = (index: number, _item: any) => index;

  filter(event: any) {
    const value = event.target.value;
    this.store.dispatch(filterCurrencies({ value }));
  }

  copyAndAddEntry(entryDate: Date) {
    this.store.dispatch(copyAndAddEntry({ entryDate }));
  }

  addAsset(entryDate: Date) {
    this.store.dispatch(addAsset({ entryDate, base: this.ratesService.base }));
  }

  addDebt(entryDate: Date) {
    this.store.dispatch(addDebt({ entryDate, base: this.ratesService.base }));
  }

  removeEntry(entryDate: Date) {
    this.store.dispatch(removeEntry({ entryDate }));
  }

  removeAsset(entryDate: Date, assetIndex: number) {
    this.store.dispatch(removeAsset({ entryDate, assetIndex, base: this.ratesService.base }));
  }

  removeDebt(entryDate: Date, debtIndex: number) {
    this.store.dispatch(removeDebt({ entryDate, debtIndex, base: this.ratesService.base }));
  }

  fillRates(entry: Entry) {
    this.store.dispatch(fillRates({ entryDate: entry.date, entryRatesKeys: Object.keys(entry.rates) }));
  }

  getCurrency(code: string): Observable<Currency> {
    return this.currencies$.pipe(map(currencies => currencies.find(currency => currency.code === code) ?? new Currency(code, '')));
  }

  setRate(entryDate: Date, rateKey: string, event: Event) {
    this.store.dispatch(setRate({ entryDate, rateKey, rateValue: (event.target as any).value }));
  }

  setDate(entryDate: Date, value: Date) {
    this.store.dispatch(setDate({ entryDate, value }));
  }

  setAsset(entryDate: Date, assetIndex: number, field: string, event: any) {
    const value = event instanceof Event ? (event.target as any).value : event;
    this.store.dispatch(setAsset({ entryDate, assetIndex, field, value, base: this.ratesService.base }));
  }

  setDebt(entryDate: Date, debtIndex: number, field: string, event: any) {
    const value = event instanceof Event ? (event.target as any).value : event;
    this.store.dispatch(setDebt({ entryDate, debtIndex, field, value, base: this.ratesService.base }));
  }
}
