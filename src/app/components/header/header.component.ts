import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  photoUrl?: string;

  constructor(public authenticationService: AuthenticationService,
    private router: Router) {
    this.photoUrl = this.authenticationService.getCurrentUser()?.photoURL ?? undefined;
  }

  async logout() {
    await this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
