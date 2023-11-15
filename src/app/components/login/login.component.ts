import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isBusy = false;
  email = '';
  password = '';
  isRemember = false;

  constructor(private snackBarService: SnackBarService,
    private authenticationService: AuthenticationService,
    private router: Router) {
  }

  async login() {
    try {
      this.isBusy = true;
      await this.authenticationService.login(this.email, this.password, this.isRemember);
      await this.router.navigate(['/dashboard']);
    } catch (error: any) {
      this.snackBarService.showSnackBar(error);
    } finally {
      this.isBusy = false;
    }
  }
}
