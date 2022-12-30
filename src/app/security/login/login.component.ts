import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { User } from 'src/app/core/models/user';
import { ErrorDetails, GenericValidator } from 'src/app/shared/generic-validator';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup = new FormGroup({})

  errorMap = new Map<string, ErrorDetails>();

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.buildUserForm()
  }

  buildUserForm() {
    this.loginForm = this.formBuilder.group(
      {
        email: [null, [Validators.required, Validators.email, Validators.maxLength(70)]],
        password: [null, [Validators.required, Validators.maxLength(70)]]
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

  login() {
    if (this.loginForm.invalid)
      return;

    const user: User = Object.assign({}, this.loginForm.value)
    this.authService.login(user).subscribe({
      next: (result) => this.handleSuccess(result),
      error: (error) => this.handleError(error)
    })
  }

  handleSuccess(result: any) {
    this.router.navigate(['home'])
    // window.alert('Seja bem-vindo')

    // TODO Ordernar Observables
  }

  handleError(error: any) {
    console.log(error)
    window.alert('Erro de autenticação')
  }
}
