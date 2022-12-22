import { FormGroup } from "@angular/forms"

export abstract class GenericValidator {
    public static getErrorMessage(fieldName: string, form: FormGroup) {
        if (form.get(fieldName)?.hasError('required') && form.get(fieldName)?.dirty)
            return 'Campo obrigatório'

        if (form.get(fieldName)?.hasError('minlength') && form.get(fieldName)?.dirty)
            return `Tamanho mínimo de ${form.get(fieldName)?.errors?.['minlength'].requiredLength} caracteres`

        if (form.get(fieldName)?.hasError('maxlength') && form.get(fieldName)?.dirty)
            return `Tamanho máximo de ${form.get(fieldName)?.errors?.['maxlength'].requiredLength} caracteres`

        if (form.get(fieldName)?.hasError('email') && form.get(fieldName)?.dirty)
            return `E-mail em formato inválido`

        if (form.get(fieldName)?.errors?.equals == false && form.get(fieldName)?.dirty)
            return 'Campos não coincidem'

        return undefined
    }
}
