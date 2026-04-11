import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent, MatCardFooter, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatProgressBar } from '@angular/material/progress-bar';
import { SnackBarService } from '../../services/snack-bar.service';
import { SettingsService } from '../../services/settings.service';
import { Settings } from '../../models/settings';

@Component({
  selector: 'app-settings',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatFormField,
    MatInput,
    FormsModule,
    MatCardActions,
    MatButton,
    MatIcon,
    MatCardFooter,
    MatProgressBar
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent implements OnInit {
  private readonly snackBarService = inject(SnackBarService);
  private readonly settingsService = inject(SettingsService);
  isBusy = signal(false);
  settings = signal(new Settings(undefined));

  ngOnInit(): void {
    this.settingsService.getSettings().then(settings => {
      this.settings.set(settings);
    });
  }

  async saveSettings() {
    try {
      this.isBusy.set(true);
      await this.settingsService.setSettings(this.settings());
      this.snackBarService.open('Settings saved successfully.');
    } catch (error: any) {
      this.snackBarService.open(error);
    } finally {
      this.isBusy.set(false);
    }
  }
}
