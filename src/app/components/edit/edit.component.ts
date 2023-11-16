import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
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
  oldPassword = '';
  newPassword = '';
  newPasswordRepeat = '';

  constructor(private snackBarService: SnackBarService,
    private authenticationService: AuthenticationService,
    private router: Router) {
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
      this.isBusy = true;

    } catch (error: any) {
      this.snackBarService.showSnackBar(error);
    } finally {
      this.isBusy = false;
    }
  }

  async cancel() {
    try {
      this.isBusy = true;
      await this.router.navigate(['/dashboard']);
    } catch (error: any) {
      this.snackBarService.showSnackBar(error);
    } finally {
      this.isBusy = false;
    }
  }
}
