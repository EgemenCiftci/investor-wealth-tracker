import { createReducer, on } from '@ngrx/store';
import { Entry } from '../models/entry';
import { addEntry, copyAndAddEntry, removeEntry, loadDataSuccess, fillRates, loadData, loadDataError, addAsset, removeAsset, addDebt, removeDebt, setRate, fillRatesSuccess, fillRatesError, filterCurrencies, saveEntries, saveEntriesSuccess, saveEntriesError } from '../actions/entries.actions';
import { cloneDeep } from 'lodash';
import { AssetTypes } from '../enums/asset-types';
import { Asset } from '../models/asset';
import { Debt } from '../models/debt';
import { DebtTypes } from '../enums/debt-types';
import { Currency } from '../models/currency';

export interface AppStore {
    entriesState: EntriesState;
}

export interface EntriesState {
    entries: Entry[],
    isBusy: boolean,
    currencies: Currency[],
    filteredCurrencies: Currency[]
}

export const initialState: EntriesState = { entries: [], isBusy: false, currencies: [], filteredCurrencies: [] };

export const entriesReducer = createReducer(
    initialState,
    on(loadData, state => {
        const cloneState = cloneDeep(state);
        cloneState.isBusy = true;
        return cloneState;
    }),
    on(loadDataSuccess, (state, { entries, currencies }) => {
        const cloneState = cloneDeep(state);
        cloneState.entries = entries;
        cloneState.currencies = currencies;
        cloneState.filteredCurrencies = currencies;
        cloneState.isBusy = false;
        return cloneState;
    }),
    on(loadDataError, state => {
        const cloneState = cloneDeep(state);
        cloneState.isBusy = false;
        return cloneState;
    }),
    on(saveEntries, state => {
        const cloneState = cloneDeep(state);
        cloneState.isBusy = true;
        return cloneState;
    }),
    on(saveEntriesSuccess, state => {
        const cloneState = cloneDeep(state);
        cloneState.isBusy = false;
        return cloneState;
    }),
    on(saveEntriesError, state => {
        const cloneState = cloneDeep(state);
        cloneState.isBusy = false;
        return cloneState;
    }),
    on(addEntry, (state, { base }) => {
        const cloneState = cloneDeep(state);
        if (!cloneState.entries) {
            cloneState.entries = [];
        }
        cloneState.entries.push(new Entry(new Date(), { [base]: 1 }, [], []));
        return cloneState;
    }),
    on(copyAndAddEntry, (state, { entryDate }) => {
        const cloneState = cloneDeep(state);
        const entry = cloneState.entries.find(x => x.date.getTime() === entryDate.getTime());
        if (entry) {
            entry.date = new Date();
            cloneState.entries.push(entry);
        }
        return cloneState;
    }),
    on(removeEntry, (state, { entryDate }) => {
        const cloneState = cloneDeep(state);
        cloneState.entries = cloneState.entries.filter((entry) => entry.date.getTime() !== entryDate.getTime());
        return cloneState;
    }),
    on(addAsset, (state, { entryDate, base }) => {
        const cloneState = cloneDeep(state);
        const entry = cloneState.entries.find(x => x.date.getTime() === entryDate.getTime());
        if (entry) {
            if (!entry.assets) {
                entry.assets = [];
            }
            entry.assets.push(new Asset(AssetTypes.liquid, '', 0, base));
            entry.updateRates(base);
        }
        return cloneState;
    }),
    on(removeAsset, (state, { entryDate, assetIndex, base }) => {
        const cloneState = cloneDeep(state);
        const entry = cloneState.entries.find(x => x.date.getTime() === entryDate.getTime());
        if (entry && entry.assets) {
            entry.assets.splice(assetIndex, 1);
            entry.updateRates(base);
        }
        return cloneState;
    }),
    on(addDebt, (state, { entryDate, base }) => {
        const cloneState = cloneDeep(state);
        const entry = cloneState.entries.find(x => x.date.getTime() === entryDate.getTime());
        if (entry) {
            if (!entry.debts) {
                entry.debts = [];
            }
            entry.debts.push(new Debt(DebtTypes.shortTerm, '', 0, base));
            entry.updateRates(base);
        }
        return cloneState;
    }),
    on(removeDebt, (state, { entryDate, debtIndex, base }) => {
        const cloneState = cloneDeep(state);
        const entry = cloneState.entries.find(x => x.date.getTime() === entryDate.getTime());
        if (entry && entry.debts) {
            entry.debts.splice(debtIndex, 1);
            entry.updateRates(base);
        }
        return cloneState;
    }),
    on(fillRates, state => {
        const cloneState = cloneDeep(state);
        cloneState.isBusy = true;
        return cloneState;
    }),
    on(fillRatesSuccess, (state, { entryDate, rates }) => {
        const cloneState = cloneDeep(state);
        cloneState.isBusy = false;
        const entry = cloneState.entries.find(x => x.date.getTime() === entryDate.getTime());
        if (entry && entry.rates) {
            Object.entries(rates).forEach(e => {
                entry.rates[e[0]] = e[1];
            });
        }
        return cloneState;
    }),
    on(fillRatesError, (state) => {
        const cloneState = cloneDeep(state);
        cloneState.isBusy = false;
        return cloneState;
    }),
    on(setRate, (state, { entryDate, rateKey, rateValue }) => {
        const cloneState = cloneDeep(state);
        const entry = cloneState.entries.find(x => x.date.getTime() === entryDate.getTime());
        if (entry && entry.rates) {
            entry.rates[rateKey] = rateValue;
        }
        return cloneState;
    }),
    on(filterCurrencies, (state, { value }) => {
        const cloneState = cloneDeep(state);
        cloneState.filteredCurrencies = cloneState.currencies.filter(c => c.toString().toLowerCase().includes(value.toLowerCase()));
        return cloneState;
    }),
);