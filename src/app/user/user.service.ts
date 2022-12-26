import { Injectable } from '@angular/core';
import { User } from '../core/models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  users: User[] = [{
    id: 1,
    name: "João",
    email: "joao@gmail.com",
    createdAt: new Date(2022, 11, 24, 18, 45, 44),
    lastUpdated: new Date(2022, 11, 24, 18, 45, 44)
  },
  {
    id: 2,
    name: "Maria",
    email: "maria@gmail.com",
    createdAt: new Date(2022, 11, 24, 18, 45, 44),
    lastUpdated: new Date(2022, 11, 24, 18, 45, 44)
  },
  {
    id: 3,
    name: "Alisson",
    email: "alisson@gmail.com",
    createdAt: new Date(2022, 11, 24, 18, 45, 44),
    lastUpdated: new Date(2022, 11, 24, 18, 45, 44)
  }]

  constructor() { }

  getUsers() {
    return this.users
  }
}
