import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ErrorDetails, GenericValidator } from 'src/app/shared/generic-validator';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  emailForm: FormGroup = new FormGroup({})

  errorMap = new Map<string, ErrorDetails>();

  constructor(private formBuilder: FormBuilder) { }

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
}
