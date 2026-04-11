import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { DialogService } from '../../services/dialog.service';
import { EntriesService } from '../../services/entries.service';
import { SnackBarService } from '../../services/snack-bar.service';
import { lastValueFrom } from 'rxjs';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatCardActions, MatCardFooter } from '@angular/material/card';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  ]
})
export class EditComponent implements OnInit {
  private readonly snackBarService = inject(SnackBarService);
  private readonly authenticationService = inject(AuthenticationService);
  private readonly router = inject(Router);
  private readonly dialogService = inject(DialogService);
  private readonly entriesService = inject(EntriesService);

  isBusy = signal(false);
  displayName: string | undefined;
  email: string | undefined;

  ngOnInit() {
    const currentUser = this.authenticationService.getCurrentUser();
    if (currentUser) {
      this.displayName = currentUser.displayName ?? undefined;
      this.email = currentUser.email ?? undefined;
    }
  }

  async saveDisplayName(displayName: string) {
    try {
      if (!displayName) {
        this.snackBarService.open('Display name is required.');
        return;
      }
      if (displayName === this.authenticationService.getCurrentUser()?.displayName) {
        this.snackBarService.open('Display name is same as current.');
        return;
      }
      this.isBusy.set(true);
      await this.authenticationService.updateDisplayName(displayName);
      this.snackBarService.open('Saved successfully.');
    } catch (error: any) {
      this.snackBarService.open(error);
    } finally {
      this.isBusy.set(false);
    }
  }

  async saveEmail(email: string, password: string) {
    try {
      if (!email) {
        this.snackBarService.open('Email is required.');
        return;
      }
      if (email === this.authenticationService.getCurrentUser()?.email) {
        this.snackBarService.open('Email is same as current.');
        return;
      }
      this.isBusy.set(true);
      const result = await lastValueFrom(this.dialogService.openDialog('Update Email', 'Your email will be updated with the new one. Do you want to continue?').afterClosed());
      if (result) {
        await this.authenticationService.updateEmail(email, password);
        this.snackBarService.open('We have sent a verification to your old email. Please check.');
      }
    } catch (error: any) {
      this.snackBarService.open(error);
    } finally {
      this.isBusy.set(false);
    }
  }

  async savePassword(oldPassword: string, newPassword: string, newPasswordRepeat: string) {
    try {
      if (!oldPassword) {
        this.snackBarService.open('Password is required.');
        return;
      }
      if (!newPassword || !newPasswordRepeat) {
        this.snackBarService.open('New password is required.');
        return;
      }
      if (newPassword !== newPasswordRepeat) {
        this.snackBarService.open('New passwords do not match.');
        return;
      }
      this.isBusy.set(true);
      await this.authenticationService.updatePassword(oldPassword, newPassword);
      this.snackBarService.open('Saved successfully.');
    } catch (error: any) {
      this.snackBarService.open(error);
    } finally {
      this.isBusy.set(false);
    }
  }

  async downloadMyData() {
    try {
      this.isBusy.set(true);
      let element = document.createElement('a');
      const entries = await this.entriesService.getEntries();
      element.href = globalThis.URL.createObjectURL(new Blob([JSON.stringify(entries)], { type: "application/json" }));
      element.download = 'data.json';
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      element.remove();
      globalThis.URL.revokeObjectURL(element.href);
    } catch (error: any) {
      this.snackBarService.open(error);
    } finally {
      this.isBusy.set(false);
    }
  }

  async deleteMyData(password: string) {
    try {
      this.isBusy.set(true);
      const result = await lastValueFrom(this.dialogService.openDialog('Delete My Data', 'Your account and your data will be deleted. Do you want to continue?').afterClosed());
      if (result) {
        await this.authenticationService.deleteUser(password);
        await this.entriesService.deleteUser();
        await this.router.navigate(['/dashboard']);
      }
    } catch (error: any) {
      this.snackBarService.open(error);
    } finally {
      this.isBusy.set(false);
    }
  }
}
