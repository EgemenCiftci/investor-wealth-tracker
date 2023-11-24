import { Component } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  photoUrl?: string;

  constructor(public authenticationService: AuthenticationService,
    private router: Router) {
      this.photoUrl = this.authenticationService.getCurrentUser()?.photoURL ?? undefined;
  }

  async logout() {
    await this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  getUserLetter() {
    return this.getDisplayName()?.charAt(0)?.toUpperCase() ?? '?';
  }

  getDisplayName() {
    return this.authenticationService.getCurrentUser()?.displayName;
  }
}
