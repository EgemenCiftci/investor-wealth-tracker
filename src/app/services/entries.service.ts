import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { Database, child, get, ref, remove, set } from '@angular/fire/database';
import { Entry } from '../models/entry';

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
    const entries = (await get(child(currentUserRef, 'entries'))).val();
    return Object.entries(entries).map(([key, value]: [string, any]) => new Entry(new Date(key), value.rates, value.assets, value.debts));
  }

  async setEntries(entries: Entry[]) {
    const currentUser = this.authenticationService.getCurrentUser();
    const currentUserRef = ref(this.database, `users/${currentUser?.uid}`);
    let entries0: any = {};
    entries.forEach(e => {
      const key = this.formatDate(e.date);
      entries0[key] = { assets: e.assets, debts: e.debts, rates: e.rates };
    });
    return await set(child(currentUserRef, 'entries'), entries0);
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

  getTotalNetWorth(entry: Entry): number {
    return this.getTotalAssets(entry) - this.getTotalDebts(entry);
  }

  getTotalAssets(entry: Entry): number {
    let sum = 0;
    entry.assets?.forEach(asset => {
      const rate = entry.rates[asset.currencyCode] ?? 0;
      sum += asset.value / rate;
    });
    return sum;
  }

  getTotalDebts(entry: Entry): number {
    let sum = 0;
    entry.debts?.forEach(debt => {
      const rate = entry.rates[debt.currencyCode] ?? 0;
      sum += debt.value / rate;
    });
    return sum;
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
