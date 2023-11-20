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
  constructor(private database: Database,
    private authenticationService: AuthenticationService) {
  }

  async getEntries(): Promise<Entry[]> {
    const currentUser = this.authenticationService.getCurrentUser();
    const currentUserRef = ref(this.database, `users/${currentUser?.uid}`);
    return (await get(child(currentUserRef, "entries"))).val();
  }

  async setEntries(entries: Entry[]) {
    const currentUser = this.authenticationService.getCurrentUser();
    const currentUserRef = ref(this.database, `users/${currentUser?.uid}`);
    return await set(child(currentUserRef, "entries"), entries);
  }

  async addEntry(entry: Entry) {
    const currentUser = this.authenticationService.getCurrentUser();
    const currentUserRef = ref(this.database, `users/${currentUser?.uid}`);
    const newKey = push(child(currentUserRef, `entries`)).key;
    await set(child(currentUserRef, `entries/${newKey}`), entry);
  }

  async updateEntry(entryKey: number, entry: Entry) {
    const currentUser = this.authenticationService.getCurrentUser();
    const currentUserRef = ref(this.database, `users/${currentUser?.uid}`);
    await update(child(currentUserRef, `entries/${entryKey}`), entry);
  }

  async deleteEntry(entryKey: string) {
    const currentUser = this.authenticationService.getCurrentUser();
    const currentUserRef = ref(this.database, `users/${currentUser?.uid}`);
    await remove(child(currentUserRef, `entries/${entryKey}`));
  }

  async addAsset(entryKey: string, asset: any) {
    const currentUser = this.authenticationService.getCurrentUser();
    const currentUserRef = ref(this.database, `users/${currentUser?.uid}`);
    const newKey = push(child(currentUserRef, `entries/${entryKey}/assets`)).key;
    await set(child(currentUserRef, `entries/${entryKey}/assets/${newKey}`), asset);

  }

  async updateAsset(entryKey: string, asset: any) {
    const currentUser = this.authenticationService.getCurrentUser();
    const currentUserRef = ref(this.database, `users/${currentUser?.uid}`);
    await update(child(currentUserRef, `entries/${entryKey}/assets/${asset.key}`), asset);
  }

  async deleteAsset(entryKey: string, assetKey: string) {
    const currentUser = this.authenticationService.getCurrentUser();
    const currentUserRef = ref(this.database, `users/${currentUser?.uid}`);
    await remove(child(currentUserRef, `entries/${entryKey}/assets/${assetKey}`));
  }

  async addDebt(entryKey: string, debt: any) {
    const currentUser = this.authenticationService.getCurrentUser();
    const currentUserRef = ref(this.database, `users/${currentUser?.uid}`);
    const newKey = push(child(currentUserRef, `entries/${entryKey}/debts`)).key;
    await set(child(currentUserRef, `entries/${entryKey}/debts/${newKey}`), debt);
  }

  async updateDebt(entryKey: string, debt: any) {
    const currentUser = this.authenticationService.getCurrentUser();
    const currentUserRef = ref(this.database, `users/${currentUser?.uid}`);
    await update(child(currentUserRef, `entries/${entryKey}/debts/${debt.key}`), debt);
  }

  async deleteDebt(entryKey: string, debtKey: string) {
    const currentUser = this.authenticationService.getCurrentUser();
    const currentUserRef = ref(this.database, `users/${currentUser?.uid}`);
    await remove(child(currentUserRef, `entries/${entryKey}/debts/${debtKey}`));
  }

  async deleteUser() {
    const currentUser = this.authenticationService.getCurrentUser();
    if (currentUser) {
      const usersRef = ref(this.database, `users`);
      await remove(child(usersRef, currentUser.uid));
    } else {
      throw new Error('Current user is null.');
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
