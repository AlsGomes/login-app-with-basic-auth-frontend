import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { ForgotPassword } from '../core/models/forgot-password';
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

    return new Observable(subscriber => {
      firstValueFrom(this.http.post<User>(`${environment.apiUrl}/authentication/login`, user))
        .then(result => {
          this.handleSuccess(result)
          subscriber.next(result)
        })
        .catch(error => {
          return subscriber.error(error)
        })
        .finally(() => subscriber.complete())
    })
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

  get isCurrentUserLoggedIn(): boolean {
    return !!this.currentUser
  }

  refreshLoggedUserData() {
    if (!this.currentUser)
      return

    this.http.get<User>(`${environment.apiUrl}/users/${this.currentUser.id}`)
      .subscribe({
        next: (user) => {
          const currentUser = this.currentUser!
          currentUser.name = user.name
          currentUser.email = user.email
          currentUser.createdAt = user.createdAt
          currentUser.lastUpdated = user.lastUpdated
          this.setCurrentUser(currentUser)
        },
        error: (error) => { window.alert(error.error.detail ?? 'Erro ao buscar usuário') }
      })
  }

  refreshLoggedUserAuth(password: string) {
    if (!this.currentUser)
      return

    const currentUser = this.currentUser!
    currentUser.password = password
    this.setEncodedAuth(currentUser)
  }

  forgotPassword(email: ForgotPassword) {
    const warn = 'Alterar endpoint para exibir de alguma maneira o token ao usuário (apenas nesse caso de app demo)'
    window.alert(warn)
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
