import { Component } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Investor Wealth Tracker';

  constructor(public authenticationService: AuthenticationService,
    private router: Router) {
  }

  async logout() {
    await this.authenticationService.signOut();
    this.router.navigate(['/login']);
  }
}
