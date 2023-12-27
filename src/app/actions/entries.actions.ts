import { createAction, props } from '@ngrx/store';
import { Entry } from '../models/entry';
import { Currency } from '../models/currency';

export const loadData = createAction('[Entries] Load Data');
export const loadDataSuccess = createAction('[Entries] Load Data Success', props<{ entries: Entry[], currencies: Currency[] }>());
export const loadDataError = createAction('[Entries] Load Data Error');

export const saveEntries = createAction('[Entries] Save Entries');
export const saveEntriesSuccess = createAction('[Entries] Save Entries Success');
export const saveEntriesError = createAction('[Entries] Save Entries Error');

export const cancelEntries = createAction('[Entries] Cancel Entries');

export const addEntry = createAction('[Entries] Add Entry', props<{ base: string }>());
export const copyAndAddEntry = createAction('[Entries] Copy And Add Entry', props<{ entryDate: Date }>());
export const removeEntry = createAction('[Entries] Remove Entry', props<{ entryDate: Date }>());

export const addAsset = createAction('[Entries] Add Asset', props<{ entryDate: Date, base: string }>());
export const removeAsset = createAction('[Entries] Remove Asset', props<{ entryDate: Date, assetIndex: number, base: string }>());

export const addDebt = createAction('[Entries] Add Debt', props<{ entryDate: Date, base: string }>());
export const removeDebt = createAction('[Entries] Remove Debt', props<{ entryDate: Date, debtIndex: number, base: string }>());

export const fillRates = createAction('[Entries] Fill Rates', props<{ entryDate: Date, entryRatesKeys: string[] }>());
export const fillRatesSuccess = createAction('[Entries] Fill Rates Success', props<{ entryDate: Date, rates: ({ [key: string]: number }) }>());
export const fillRatesError = createAction('[Entries] Fill Rates Error');

export const setRate = createAction('[Entries] Set Rate', props<{ entryDate: Date, rateKey: string, rateValue: number }>());
export const setDate = createAction('[Entries] Set Date', props<{ entryDate: Date, value: Date }>());
export const setAsset = createAction('[Entries] Set Asset', props<{ entryDate: Date, assetIndex: number, field: string, value: any }>());
export const setDebt = createAction('[Entries] Set Debt', props<{ entryDate: Date, debtIndex: number, field: string, value: any }>());

export const filterCurrencies = createAction('[Entries] Filter Currencies', props<{ value: string }>());