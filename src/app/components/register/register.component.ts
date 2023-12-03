import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { SnackBarService } from '../../services/snack-bar.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  isBusy = false;
  displayName = '';
  email = '';
  password = '';
  passwordRepeat = '';

  constructor(private snackBarService: SnackBarService,
    private authenticationService: AuthenticationService,
    private router: Router) {
  }

  async register() {
    try {
      this.isBusy = true;
      if (this.password === this.passwordRepeat) {
        await this.authenticationService.register(this.displayName, this.email, this.password);
        this.snackBarService.showSnackBar('We have sent a verification email. Please check.');
        await this.router.navigate(['/dashboard']);
      } else {
        this.snackBarService.showSnackBar('Passwords do not match!');
      }
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
