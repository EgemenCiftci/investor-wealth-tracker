import { createAction, props } from '@ngrx/store';
import { Entry } from '../models/entry';

export const loadEntries = createAction('[Entry] Load Entries');

export const loadEntriesSuccess = createAction(
    '[Entry] Load Entries Success',
    props<{ entries: Entry[] }>()
);

export const addEntry = createAction(
    '[Entry] Add Entry',
    props<{ base: string }>()
);

export const copyAndAddEntry = createAction(
    '[Entry] Copy And Add Entry',
    props<{ entry: Entry }>()
);

export const deleteEntry = createAction(
    '[Entry] Delete Entry',
    props<{ entryDate: Date }>()
);
