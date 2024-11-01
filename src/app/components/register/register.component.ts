import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { SnackBarService } from '../../services/snack-bar.service';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatCardActions, MatCardFooter } from '@angular/material/card';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
    standalone: true,
    imports: [MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatFormField, MatInput, FormsModule, MatCardActions, MatButton, MatIcon, MatCardFooter, MatProgressBar]
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
