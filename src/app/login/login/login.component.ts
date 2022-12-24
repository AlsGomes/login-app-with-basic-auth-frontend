import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ErrorDetails, GenericValidator } from 'src/app/shared/generic-validator';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup = new FormGroup({})

  errorMap = new Map<string, ErrorDetails>();

  constructor(private formBuilder: FormBuilder) { }

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
}
