import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { AssetTypes } from '../../enums/asset-types';
import { DebtTypes } from '../../enums/debt-types';
import { Currency } from '../../models/currency';
import { Entry } from '../../models/entry';
import { RatesService } from '../../services/rates.service';
import { Store } from '@ngrx/store';
import { addEntry, copyAndAddEntry, removeEntry, fillRates, saveEntries, addAsset, addDebt, removeAsset, removeDebt, cancelEntries, setRate, loadData, filterCurrencies, setDate, setAsset, setDebt } from 'src/app/actions/entries.actions';
import { Observable, Subject, map } from 'rxjs';
import { AppState } from 'src/app/reducers/entries.reducer';
import { MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent, MatCardActions, MatCardFooter } from '@angular/material/card';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle, MatExpansionPanelDescription } from '@angular/material/expansion';
import { AsyncPipe, CurrencyPipe, DatePipe, KeyValuePipe } from '@angular/common';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatDatepickerInput, MatDatepickerToggle, MatDatepicker } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatAutocompleteTrigger, MatAutocomplete } from '@angular/material/autocomplete';
import { MatProgressBar } from '@angular/material/progress-bar';
import { CamelCaseToSpacesPipe } from '../../pipes/camel-case-to-spaces.pipe';
import { TotalPipe } from '../../pipes/total.pipe';

@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatExpansionPanelDescription,
    MatFormField,
    MatLabel,
    MatInput,
    MatDatepickerInput,
    FormsModule,
    MatDatepickerToggle,
    MatSuffix,
    MatDatepicker,
    MatButton,
    MatIcon,
    MatSelect,
    MatOption,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatCardActions,
    MatCardFooter,
    MatProgressBar,
    AsyncPipe,
    CurrencyPipe,
    DatePipe,
    KeyValuePipe,
    CamelCaseToSpacesPipe,
    TotalPipe
  ]
})
export class EntriesComponent implements OnInit, OnDestroy {
  ratesService = inject(RatesService);
  private store = inject<Store<AppState>>(Store);

  entries$ = this.store.select(x => x.entriesReducer.entries);
  isBusy$ = this.store.select(x => x.progressReducer.isBusy);
  currencies$ = this.store.select(x => x.entriesReducer.currencies);
  filteredCurrencies$ = this.store.select(x => x.entriesReducer.filteredCurrencies);
  assetTypes = Object.entries(AssetTypes);
  debtTypes = Object.entries(DebtTypes);
  trackByFn = (index: number, _item: any) => index;
  private _unsubscribe$ = new Subject<void>();

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
