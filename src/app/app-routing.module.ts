import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authenticationGuard } from './guards/authentication.guard';

const routes: Routes = [
  { path: '', loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent), canActivate: [authenticationGuard] },
  { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent), canActivate: [authenticationGuard] },
  { path: 'register', loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent), canActivate: [authenticationGuard] },
  { path: 'edit', loadComponent: () => import('./components/edit/edit.component').then(m => m.EditComponent), canActivate: [authenticationGuard] },
  { path: 'entries', loadComponent: () => import('./components/entries/entries.component').then(m => m.EntriesComponent), canActivate: [authenticationGuard] },
  { path: 'about', loadComponent: () => import('./components/about/about.component').then(m => m.AboutComponent) },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
