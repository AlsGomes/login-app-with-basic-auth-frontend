import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HomeModule } from '../home/home.module';
import { AuthenticationService } from '../login/authentication.service';
import { LoginModule } from '../login/login.module';
import { UserService } from '../user/user.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,

    LoginModule,
    HomeModule
  ],
  providers:[
    UserService,
    AuthenticationService
  ]
})
export class CoreModule { }
