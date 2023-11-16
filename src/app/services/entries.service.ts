import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { Database, DatabaseReference, child, get, push, ref, remove, set, update } from '@angular/fire/database';
import { Entry } from '../models/entry';
import { Asset } from '../models/asset';
import { Debt } from '../models/debt';

@Injectable({
  providedIn: 'root'
})
export class EntriesService {
  private currentUserRef: DatabaseReference | undefined = undefined;

  constructor(private database: Database,
    private authenticationService: AuthenticationService) {
  }

  init() {
    const currentUser = this.authenticationService.getCurrentUser();
    if (currentUser) {
      this.currentUserRef = ref(this.database, `users/${currentUser.uid}`);
    } else {
      this.currentUserRef = undefined;
    }
  }

  async getEntries(): Promise<Entry[]> {
    if (this.currentUserRef) {
      return (await get(child(this.currentUserRef, "entries"))).val();
    } else {
      throw new Error("Entries service is not initialized.");
    }
  }

  async setEntries(entries: Entry[]) {
    if (this.currentUserRef) {
      return await set(child(this.currentUserRef, "entries"), entries);
    } else {
      throw new Error("Entries service is not initialized.");
    }
  }

  async addEntry(entry: Entry) {
    if (this.currentUserRef) {
      const newKey = push(child(this.currentUserRef, `entries`)).key;
      await set(child(this.currentUserRef, `entries/${newKey}`), entry);
    } else {
      throw new Error("Entries service is not initialized.");
    }
  }

  async updateEntry(entryKey: number, entry: Entry) {
    if (this.currentUserRef) {
      await update(child(this.currentUserRef, `entries/${entryKey}`), entry);
    } else {
      throw new Error("Entries service is not initialized.");
    }
  }

  async deleteEntry(entryKey: string) {
    if (this.currentUserRef) {
      await remove(child(this.currentUserRef, `entries/${entryKey}`));
    } else {
      throw new Error("Entries service is not initialized.");
    }
  }

  async addAsset(entryKey: string, asset: any) {
    if (this.currentUserRef) {
      const newKey = push(child(this.currentUserRef, `entries/${entryKey}/assets`)).key;
      await set(child(this.currentUserRef, `entries/${entryKey}/assets/${newKey}`), asset);
    } else {
      throw new Error("Entries service is not initialized.");
    }
  }

  async updateAsset(entryKey: string, asset: any) {
    if (this.currentUserRef) {
      await update(child(this.currentUserRef, `entries/${entryKey}/assets/${asset.key}`), asset);
    } else {
      throw new Error("Entries service is not initialized.");
    }
  }

  async deleteAsset(entryKey: string, assetKey: string) {
    if (this.currentUserRef) {
      await remove(child(this.currentUserRef, `entries/${entryKey}/assets/${assetKey}`));
    } else {
      throw new Error("Entries service is not initialized.");
    }
  }

  async addDebt(entryKey: string, debt: any) {
    if (this.currentUserRef) {
      const newKey = push(child(this.currentUserRef, `entries/${entryKey}/debts`)).key;
      await set(child(this.currentUserRef, `entries/${entryKey}/debts/${newKey}`), debt);
    } else {
      throw new Error("Entries service is not initialized.");
    }
  }

  async updateDebt(entryKey: string, debt: any) {
    if (this.currentUserRef) {
      await update(child(this.currentUserRef, `entries/${entryKey}/debts/${debt.key}`), debt);
    } else {
      throw new Error("Entries service is not initialized.");
    }
  }

  async deleteDebt(entryKey: string, debtKey: string) {
    if (this.currentUserRef) {
      await remove(child(this.currentUserRef, `entries/${entryKey}/debts/${debtKey}`));
    } else {
      throw new Error("Entries service is not initialized.");
    }
  }

  getValueSum(array: Asset[] | Debt[] | undefined): number {
    return array?.map(x => x.value).reduce((x, y) => x + y, 0) ?? 0;
  }

  getTotalNetWorth(entry: Entry): number {
    return this.getValueSum(entry.assets) - this.getValueSum(entry.debts);
  }

  getTotalAssets(entry: Entry): number {
    return this.getValueSum(entry.assets);
  }

  getTotalDebts(entry: Entry): number {
    return this.getValueSum(entry.debts);
  }
}
