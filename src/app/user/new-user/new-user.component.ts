import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ErrorDetails, GenericValidator } from 'src/app/shared/generic-validator';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit {

  userForm: FormGroup = new FormGroup({})

  errorMap = new Map<string, ErrorDetails>();

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.buildUserForm()
  }

  buildUserForm() {
    this.userForm = this.formBuilder.group(
      {
        name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(70)]],
        email: [null, [Validators.required, Validators.email, Validators.maxLength(70)]],
        pass: this.formBuilder.group(
          {
            password: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(70)]],
            confirmationPassword: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(70)]]
          },
          {
            validators: this.equalityBetween,
            updateOn: 'blur'
          })
      },
      {
        updateOn: 'blur'
      })
  }

  equalityBetween(group: AbstractControl) {
    const password = group.get('password')?.value;
    const confirmationPassword = group.get('confirmationPassword')?.value;

    if (!password || !confirmationPassword)
      return null

    const equalsObj = (password == confirmationPassword ? null : { equals: false })

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