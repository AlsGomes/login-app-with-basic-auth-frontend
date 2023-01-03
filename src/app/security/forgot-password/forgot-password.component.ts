import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ForgotPassword } from 'src/app/core/models/forgot-password';

import { ErrorDetails, GenericValidator } from 'src/app/shared/generic-validator';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  emailForm: FormGroup = new FormGroup({})

  errorMap = new Map<string, ErrorDetails>();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.buildUserForm()
  }

  buildUserForm() {
    this.emailForm = this.formBuilder.group(
      {
        email: [null, [Validators.required, Validators.email, Validators.maxLength(70)]]
      },
      {
        updateOn: 'blur'
      }
    )
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

  forgotPassword() {
    if (this.emailForm.invalid)
      return

    const email: ForgotPassword = { email: this.emailForm.get('email')!.value }

    this.authService.forgotPassword(email)
      .subscribe({
        next: (result) => {
          this.router.navigate(['create-new-password', result.token])
        },
        error: (error) => { window.alert(error.error.detail ?? 'Erro na tentativa de recuperar a senha') }
      })
  }
}
