import { Injectable } from '@angular/core';

import { User } from '../core/models/user';

const LOCAL_STORAGE_ENCODED_AUTH: string = 'encodedAuth'

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

  get encodedAuth() {
    return localStorage.getItem(LOCAL_STORAGE_ENCODED_AUTH) || 'YWxpc3NvbkBnbWFpbC5jb206MTIzNDU2Nzg='
  }
}
