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
    return (await get(child(currentUserRef, "entries"))).val();
  }

  async setEntries(entries: Entry[]) {
    const currentUser = this.authenticationService.getCurrentUser();
    const currentUserRef = ref(this.database, `users/${currentUser?.uid}`);
    return await set(child(currentUserRef, "entries"), entries);
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
      const rate = entry.rates.find(r => r.currencyCode === asset.currencyCode)?.value ?? 0;
      sum += asset.value / rate;
    });
    return sum;
  }

  getTotalDebts(entry: Entry): number {
    let sum = 0;
    entry.debts?.forEach(debt => {
      const rate = entry.rates.find(r => r.currencyCode === debt.currencyCode)?.value ?? 0;
      sum += debt.value / rate;
    });
    return sum;
  }
}
