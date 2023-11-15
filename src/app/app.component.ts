import { Component } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public authenticationService: AuthenticationService,
    private router: Router) {
  }

  async logout() {
    await this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  getUserLetter() {
    return this.authenticationService.getCurrentUser()?.displayName?.charAt(0)?.toUpperCase() ?? '?';
  }
}
