import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ErrorDetails, GenericValidator } from 'src/app/shared/generic-validator';

@Component({
  selector: 'app-create-new-password',
  templateUrl: './create-new-password.component.html',
  styleUrls: ['./create-new-password.component.css']
})
export class CreateNewPasswordComponent implements OnInit {

  passForm: FormGroup = new FormGroup({})

  errorMap = new Map<string, ErrorDetails>();

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.buildPassForm()
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

}
