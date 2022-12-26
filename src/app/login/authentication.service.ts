import { Injectable } from '@angular/core';
import { User } from '../core/models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor() { }

  get isAdmin() {
    return true
  }

  get currentUser() {
    return {
      name: 'Alisson Gomes',
      email: 'alisson@gmail.com'
    } as User
  }
}
