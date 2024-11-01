import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIconButton, MatButton, MatMiniFabButton } from '@angular/material/button';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
    standalone: true,
    imports: [MatToolbar, MatIconButton, MatMenuTrigger, MatIcon, MatMenu, MatMenuItem, RouterLink, MatButton, RouterLinkActive, MatMiniFabButton, MatTooltip, NgIf]
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
