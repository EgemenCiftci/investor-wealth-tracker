import { inject, Injectable } from '@angular/core';
import { child, Database, get, ref, set } from '@angular/fire/database';
import { AuthenticationService } from './authentication.service';
import { Settings } from '../models/settings';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly database = inject(Database);
  private readonly authenticationService = inject(AuthenticationService);

  async getSettings(): Promise<Settings> {
    const currentUser = this.authenticationService.getCurrentUser();
    const currentUserRef = ref(this.database, `users/${currentUser?.uid}`);
    const settings = (await get(child(currentUserRef, 'settings'))).val();
    if (!settings) {
      return new Settings(undefined);
    }
    return new Settings(settings.geminiApiKey);
  }

  async setSettings(settings: Settings) {
    const currentUser = this.authenticationService.getCurrentUser();
    const currentUserRef = ref(this.database, `users/${currentUser?.uid}`);
    return await set(child(currentUserRef, 'settings'), settings);
  }
}
