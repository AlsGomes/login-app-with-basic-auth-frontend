import { FormGroup } from "@angular/forms"

export interface ErrorDetails {
    hasError?: boolean
    message?: string
}

let erroMap = new Map<string, ErrorDetails>();

export abstract class GenericValidator {
    public static getErrorMessage(fieldName: string, form: FormGroup): Map<string, ErrorDetails> {
        if (form.get(fieldName)?.hasError('required') && form.get(fieldName)?.dirty) {
            return erroMap.set(fieldName, { hasError: true, message: 'Preenchimento obrigatório' } as ErrorDetails)
        } else {
            erroMap.delete(fieldName)
        }

        if (form.get(fieldName)?.hasError('minlength') && form.get(fieldName)?.dirty) {
            return erroMap.set(fieldName, { hasError: true, message: `Tamanho mínimo de ${form.get(fieldName)?.errors?.['minlength'].requiredLength} caracteres` } as ErrorDetails)
        } else {
            erroMap.delete(fieldName)
        }

        if (form.get(fieldName)?.hasError('maxlength') && form.get(fieldName)?.dirty) {
            return erroMap.set(fieldName, { hasError: true, message: `Tamanho máximo de ${form.get(fieldName)?.errors?.['maxlength'].requiredLength} caracteres` } as ErrorDetails)
        } else {
            erroMap.delete(fieldName)
        }

        if (form.get(fieldName)?.hasError('email') && form.get(fieldName)?.dirty) {
            return erroMap.set(fieldName, { hasError: true, message: `E-mail em formato inválido` } as ErrorDetails)
        } else {
            erroMap.delete(fieldName)
        }

        if (form.get(fieldName)?.errors?.equals == false && form.get(fieldName)?.dirty) {
            return erroMap.set(fieldName, { hasError: true, message: 'Campos não coincidem' } as ErrorDetails)
        } else {
            erroMap.delete(fieldName)
        }

        return erroMap
    }
}
