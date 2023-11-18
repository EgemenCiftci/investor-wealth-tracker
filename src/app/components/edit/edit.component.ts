import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DialogService } from 'src/app/services/dialog.service';
import { EntriesService } from 'src/app/services/entries.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  isBusy = false;
  displayName: string | undefined;
  email: string | undefined;

  constructor(private snackBarService: SnackBarService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private dialogService: DialogService,
    private entriesService: EntriesService) {
    this.entriesService.init();
  }

  ngOnInit(): void {
    const currentUser = this.authenticationService.getCurrentUser();
    if (currentUser) {
      this.displayName = currentUser.displayName ?? undefined;
      this.email = currentUser.email ?? undefined;
    }
  }

  async save() {
    try {
      if (!this.displayName) {
        this.snackBarService.showSnackBar('Display name is required.');
        return;
      }

      if (!this.email) {
        this.snackBarService.showSnackBar('Email is required.');
        return;
      }

      this.isBusy = true;
      this.authenticationService.updateUser(this.displayName, this.email);
      this.snackBarService.showSnackBar('Saved successfully.');
    } catch (error: any) {
      this.snackBarService.showSnackBar(error);
    } finally {
      this.isBusy = false;
    }
  }

  async savePassword(oldPassword: string, newPassword: string, newPasswordRepeat: string) {
    try {
      if (newPassword !== newPasswordRepeat) {
        this.snackBarService.showSnackBar('Passwords do not match.');
        return;
      }

      this.isBusy = true;
      this.authenticationService.updatePassword(oldPassword, newPassword);
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
      this.dialogService.openDialog('Delete All My Data', 'Your account and your data will be deleted. Do you want to continue?', [
        {
          content: 'Cancel', isInitialFocus: false, click: () => { }
        },
        {
          content: 'Ok', isInitialFocus: true, click: async () => {
            await this.entriesService.deleteUser();
            await this.authenticationService.deleteUser(password);
            await this.router.navigate(['/dashboard']);
          }
        }]);
    } catch (error: any) {
      this.snackBarService.showSnackBar(error);
    } finally {
      this.isBusy = false;
    }
  }
}
