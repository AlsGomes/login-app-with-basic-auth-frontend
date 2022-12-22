import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HomeModule } from '../home/home.module';
import { LoginModule } from '../login/login.module';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,

    LoginModule,
    HomeModule
  ]
})
export class CoreModule { }
