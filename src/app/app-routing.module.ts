import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home/home.component';
import { CreateNewPasswordComponent } from './security/create-new-password/create-new-password.component';
import { ForgotPasswordComponent } from './security/forgot-password/forgot-password.component';
import { LoginComponent } from './security/login/login.component';
import { NewUserComponent } from './user/new-user/new-user.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'new-user', component: NewUserComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'create-new-password', component: CreateNewPasswordComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
