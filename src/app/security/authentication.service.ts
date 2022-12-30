import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Permission } from '../core/models/permission';
import { User } from '../core/models/user';

const LOCAL_STORAGE_ENCODED_AUTH: string = 'loginapp.encodedAuth'
const LOCAL_STORAGE_CURRENT_USER: string = 'loginapp.currentUser'
const LOCAL_STORAGE_CURRENT_USER_PERMISSIONS: string = 'loginapp.userPermissions'

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(private http: HttpClient) { }

  private pass: string | undefined

  login(user: User): Observable<User> {
    this.pass = user.password

    const observable = this.http.post<User>(`${environment.apiUrl}/authentication/login`, user)
    observable.subscribe({
      next: (user) => this.handleSuccess(user),
      error: (error) => this.handleError(error)
    })

    return observable
  }

  logout() {
    this.clearData()
  }

  handleSuccess(user: User) {
    this.setCurrentUser(user)
    this.setCurrentUserPermissions(user)

    user.password = this.pass
    this.pass = undefined

    this.setEncodedAuth(user)
  }

  handleError(error: any) {
    console.log(error)
  }

  get isAdmin(): boolean {
    const permissions = this.currentUserPermissions
    if (!permissions)
      return false

    return permissions.map(permission => permission.name).includes('ROLE_USER_ADMIN')
  }

  get currentUser(): User | undefined {
    const user = localStorage.getItem(LOCAL_STORAGE_CURRENT_USER)
    if (!user)
      return undefined

    return JSON.parse(user)
  }

  get currentUserPermissions(): Permission[] | undefined {
    const user = this.currentUser
    if (!user)
      return undefined

    if (!user.permissions)
      return undefined

    return user.permissions
  }

  get encodedAuth() {
    return localStorage.getItem(LOCAL_STORAGE_ENCODED_AUTH)
  }

  private setCurrentUser(user: User) {
    localStorage.setItem(LOCAL_STORAGE_CURRENT_USER, JSON.stringify(user))
  }

  private setCurrentUserPermissions(user: User) {
    localStorage.setItem(LOCAL_STORAGE_CURRENT_USER_PERMISSIONS, JSON.stringify(user.permissions))
  }

  private setEncodedAuth(user: User) {
    const encodedAuth = this.encodeBase64(`${user.email}:${user.password}`)
    localStorage.setItem(LOCAL_STORAGE_ENCODED_AUTH, encodedAuth)
  }

  private encodeBase64(text: string): string {
    // return Buffer.from(text).toString('base64')
    return btoa(text)
  }

  private decodeBase64(text: string): string {
    // return Buffer.from(text, 'base64').toString('ascii')
    return atob(text)
  }

  private clearData() {
    localStorage.clear()
  }
}
