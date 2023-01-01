import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { ChangePassword } from '../core/models/change-password';
import { User } from '../core/models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/users`)
  }

  createNewUser(user: User): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/users`, user)
  }

  updateUser(user: User, id: number): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/users/${id}`, user)
  }

  changeOwnPassword(changePassword: ChangePassword) {
    return this.http.put<void>(`${environment.apiUrl}/users/change-my-password`, changePassword)
  }
}
