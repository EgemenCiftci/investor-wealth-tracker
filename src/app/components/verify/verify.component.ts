import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent {
  isBusy = false;

  constructor(private snackBarService: SnackBarService,
    public authenticationService: AuthenticationService,
    private router: Router) {
  }

  async verify() {
    try {
      this.isBusy = true;
      await this.authenticationService.sendEmailVerification();
      const email = this.authenticationService.getCurrentUser()?.email;
      this.snackBarService.showSnackBar(`Please check the email. ${email}`);
      await this.router.navigate(['/login']);
    } catch (error: any) {
      this.snackBarService.showSnackBar(error);
    } finally {
      this.isBusy = false;
    }
  }
}
