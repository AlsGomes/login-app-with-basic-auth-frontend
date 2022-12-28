import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

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

  users$: Observable<User[]> = new Observable<User[]>();

  userForm: FormGroup = new FormGroup({})
  passForm: FormGroup = new FormGroup({})

  errorMap = new Map<string, ErrorDetails>();

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    if (this.authService.isAdmin)
      this.fetchUsers()

    this.buildUserForm()
    this.buildPassForm()

    this.fetchCurrentUserInfo()
  }

  fetchUsers() {
    this.users$ = this.userService.getUsers$
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
    this.userForm.setValue(this.authService.currentUser)
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

  get isAdmin() {
    return this.authService.isAdmin
  }

}
