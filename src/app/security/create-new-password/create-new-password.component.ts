import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ErrorDetails, GenericValidator } from 'src/app/shared/generic-validator';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-create-new-password',
  templateUrl: './create-new-password.component.html',
  styleUrls: ['./create-new-password.component.css']
})
export class CreateNewPasswordComponent implements OnInit {

  passForm: FormGroup = new FormGroup({})

  errorMap = new Map<string, ErrorDetails>();

  token: string | undefined

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.buildPassForm()
    this.token = this.route.snapshot.params['token']
  }

  buildPassForm() {
    this.passForm = this.formBuilder.group(
      {
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

  backToLogin() {
    this.router.navigate(['login'])
  }

  createNewPassword() {
    if (!this.token)
      return

    this.authService.createNewPassword({
      token: this.token,
      password: this.passForm.get('pass')?.get('newPassword')?.value,
      confirmationPassword: this.passForm.get('pass')?.get('confirmationPassword')?.value
    }).subscribe({
      next: (result) => {
        this.router.navigate(['login'])
      },
      error: (error) => { window.alert(error.error.detail ?? 'Erro ao tentar criar nova senha') }
    })
  }

}
