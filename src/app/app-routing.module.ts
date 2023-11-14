import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EntriesComponent } from './components/entries/entries.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AboutComponent } from './components/about/about.component';
import { LoginComponent } from './components/login/login.component';
import { authenticationGuard } from './guards/authentication.guard';
import { VerifyComponent } from './components/verify/verify.component';

const routes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [authenticationGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'verify', component: VerifyComponent },
  { path: 'entries', component: EntriesComponent, canActivate: [authenticationGuard] },
  { path: 'about', component: AboutComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
