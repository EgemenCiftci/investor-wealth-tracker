import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
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
  standalone: true,
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
  private snackBarService = inject(SnackBarService);
  private authenticationService = inject(AuthenticationService);
  private router = inject(Router);
  private dialogService = inject(DialogService);
  private entriesService = inject(EntriesService);

  isBusy = false;
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
        this.snackBarService.showSnackBar('Display name is required.');
        return;
      }
      if (displayName === this.authenticationService.getCurrentUser()?.displayName) {
        this.snackBarService.showSnackBar('Display name is same as current.');
        return;
      }
      this.isBusy = true;
      await this.authenticationService.updateDisplayName(displayName);
      this.snackBarService.showSnackBar('Saved successfully.');
    } catch (error: any) {
      this.snackBarService.showSnackBar(error);
    } finally {
      this.isBusy = false;
    }
  }

  async saveEmail(email: string, password: string) {
    try {
      if (!email) {
        this.snackBarService.showSnackBar('Email is required.');
        return;
      }
      if (email === this.authenticationService.getCurrentUser()?.email) {
        this.snackBarService.showSnackBar('Email is same as current.');
        return;
      }
      this.isBusy = true;
      const result = await lastValueFrom(this.dialogService.openDialog('Update Email', 'Your email will be updated with the new one. Do you want to continue?').afterClosed());
      if (result) {
        await this.authenticationService.updateEmail(email, password);
        this.snackBarService.showSnackBar('We have sent a verification to your old email. Please check.');
      }
    } catch (error: any) {
      this.snackBarService.showSnackBar(error);
    } finally {
      this.isBusy = false;
    }
  }

  async savePassword(oldPassword: string, newPassword: string, newPasswordRepeat: string) {
    try {
      if (!oldPassword) {
        this.snackBarService.showSnackBar('Password is required.');
        return;
      }
      if (!newPassword || !newPasswordRepeat) {
        this.snackBarService.showSnackBar('New password is required.');
        return;
      }
      if (newPassword !== newPasswordRepeat) {
        this.snackBarService.showSnackBar('New passwords do not match.');
        return;
      }
      this.isBusy = true;
      await this.authenticationService.updatePassword(oldPassword, newPassword);
      this.snackBarService.showSnackBar('Saved successfully.');
    } catch (error: any) {
      this.snackBarService.showSnackBar(error);
    } finally {
      this.isBusy = false;
    }
  }

  async downloadMyData() {
    try {
      this.isBusy = true;
      let element = document.createElement('a');
      const entries = await this.entriesService.getEntries();
      element.href = window.URL.createObjectURL(new Blob([JSON.stringify(entries)], { type: "application/json" }));
      element.download = 'data.json';
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (error: any) {
      this.snackBarService.showSnackBar(error);
    } finally {
      this.isBusy = false;
    }
  }

  async deleteMyData(password: string) {
    try {
      this.isBusy = true;
      const result = await lastValueFrom(this.dialogService.openDialog('Delete My Data', 'Your account and your data will be deleted. Do you want to continue?').afterClosed());
      if (result) {
        await this.entriesService.deleteUser();
        await this.authenticationService.deleteUser(password);
        await this.router.navigate(['/dashboard']);
      }
    } catch (error: any) {
      this.snackBarService.showSnackBar(error);
    } finally {
      this.isBusy = false;
    }
  }
}
