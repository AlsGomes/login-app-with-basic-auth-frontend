import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ChangePassword } from 'src/app/core/models/change-password';
import { User } from 'src/app/core/models/user';
import { AuthenticationService } from 'src/app/security/authentication.service';
import { ErrorDetails, GenericValidator } from 'src/app/shared/generic-validator';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  isMenuVisible: boolean = false

  users: User[] = []

  userForm: FormGroup = new FormGroup({})
  passForm: FormGroup = new FormGroup({})

  errorMap = new Map<string, ErrorDetails>();

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private authService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.authService.isAdmin)
      this.fetchUsers()

    this.buildUserForm()
    this.buildPassForm()

    this.fetchCurrentUserInfo()
  }

  get isAdmin() {
    return this.authService.isAdmin
  }

  fetchUsers() {
    this.userService.getUsers()
      .subscribe({
        next: (result) => { this.users = result },
        error: (error) => { window.alert(error.error.detail ?? 'Erro ao atualizar os usuários') }
      })
  }

  buildUserForm() {
    this.userForm = this.formBuilder.group(
      {
        name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(70)]],
        email: new FormControl({ value: null, disabled: true }),
      },
      {
        updateOn: 'blur'
      })
  }

  buildPassForm() {
    this.passForm = this.formBuilder.group(
      {
        oldPassword: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(70)]],
        pass: this.formBuilder.group(
          {
            newPassword: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(70)]],
            confirmationPassword: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(70)]]
          },
          {
            validators: this.equalityBetween,
            updateOn: 'blur'
          })
      },
      {
        validators: this.equalityBetween,
        updateOn: 'blur'
      })
  }

  fetchCurrentUserInfo() {
    this.userForm.patchValue(this.authService.currentUser ?? {} as User)
  }

  updateUserInfo() {
    if (!this.authService.currentUser)
      return

    const id = this.authService.currentUser.id
    const user = { name: this.userForm.get('name')?.value } as User
    this.userService.updateUser(user, id!)
      .subscribe({
        next: (result) => { 
          this.authService.refreshLoggedUserData()
          this.fetchUsers()
        },
        error: (error) => { window.alert(error.error.detail ?? 'Erro ao atualizar os dados') }
      })
  }

  logout() {
    this.authService.logout()
    this.router.navigate(['login'])
  }

  changeOwnPassword() {
    if (!this.authService.currentUser)
      return

    const changePassword: ChangePassword = {
      oldPassword: this.passForm.get('oldPassword')!.value,
      newPassword: this.passForm.get('pass')!.get('newPassword')!.value,
      confirmationNewPassword: this.passForm.get('pass')!.get('confirmationPassword')!.value
    }
    
    this.userService.changeOwnPassword(changePassword)
      .subscribe({
        next: (result) => {
          this.authService.refreshLoggedUserAuth(changePassword.newPassword)
          this.passForm.reset()
          window.alert('Atualização realizada com sucesso!')
        },
        error: (error) => { window.alert(error.error.detail ?? 'Erro na atualização da senha') }
      })
  }

  equalityBetween(group: AbstractControl) {
    const newPassword = group.get('newPassword')?.value;
    const confirmationPassword = group.get('confirmationPassword')?.value;

    if (!newPassword || !confirmationPassword)
      return null

    const equalsObj = (newPassword == confirmationPassword ? null : { equals: false })

    return equalsObj
  }

  getErrorMessage(fieldName: string | string[], form: FormGroup) {
    if (typeof fieldName == 'string') {
      this.errorMap = GenericValidator.getErrorMessage(fieldName, form)
    }
    else {
      for (let field of fieldName) {
        this.errorMap = GenericValidator.getErrorMessage(field, form)
      }
    }
  }
}
