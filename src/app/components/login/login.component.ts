import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { SnackBarService } from '../../services/snack-bar.service';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatCardActions, MatCardFooter } from '@angular/material/card';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatFormField,
    MatInput,
    MatCheckbox,
    MatCardActions,
    MatButton,
    MatIcon,
    MatCardFooter,
    MatProgressBar
  ]
})
export class LoginComponent implements OnInit {
  private readonly snackBarService = inject(SnackBarService);
  private readonly authenticationService = inject(AuthenticationService);
  private readonly router = inject(Router);

  isBusy = signal(false);

  ngOnInit(): void {
    this.attemptSilentAutoLogin();
  }

  private async attemptSilentAutoLogin(): Promise<void> {
    try {
      this.isBusy.set(true);
      const success = await this.authenticationService.attemptSilentGoogleSignIn();
      if (success) {
        await this.router.navigate(['/dashboard']);
      }
    } catch (error: any) {
      // Silent sign-in failed, user will need to manually sign in
      this.snackBarService.showSnackBar(error);
    } finally {
      this.isBusy.set(false);
    }
  }

  async login(email: string, password: string, isRemember: boolean) {
    try {
      this.isBusy.set(true);
      await this.authenticationService.loginWithEmailPassword(email, password, isRemember);
      await this.router.navigate(['/dashboard']);
    } catch (error: any) {
      this.snackBarService.showSnackBar(error);
    } finally {
      this.isBusy.set(false);
    }
  }

  async loginWithGoogle(isRemember: boolean) {
    try {
      this.isBusy.set(true);
      await this.authenticationService.loginWithGoogle(isRemember);
      await this.router.navigate(['/dashboard']);
    } catch (error: any) {
      this.snackBarService.showSnackBar(error);
    } finally {
      this.isBusy.set(false);
    }
  }
}
