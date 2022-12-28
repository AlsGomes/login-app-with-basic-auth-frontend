import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { User } from '../core/models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUsers$: Observable<User[]> = this.http.get<User[]>(`${environment.apiUrl}/users`)

  createNewUser(user: User): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/users`, user)
  }
}
