import { createReducer, on } from '@ngrx/store';
import { Entry } from '../models/entry';
import { addEntry, copyAndAddEntry, deleteEntry, loadEntriesSuccess } from '../actions/entries.actions';

export const initialState: Entry[] = [];

export const entriesReducer = createReducer(
    initialState,
    on(loadEntriesSuccess, (state, { entries }) => entries),
    on(addEntry, (state, { base }) => [...state, new Entry(new Date(), { [base]: 1 }, [], [])]),
    on(copyAndAddEntry, (state, { entry }) => [...state, entry]),
    on(deleteEntry, (state, { entryDate }) => state.filter((entry) => entry.date !== entryDate)),
);