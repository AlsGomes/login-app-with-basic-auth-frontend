import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { HomeModule } from '../home/home.module';
import { AuthenticationService } from '../security/authentication.service';
import { SecurityModule } from '../security/security.module';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,

    SecurityModule,
    HomeModule,
    UserModule
  ],
  providers: [
    UserService,
    AuthenticationService,
    HttpClient
  ]
})
export class CoreModule { }
