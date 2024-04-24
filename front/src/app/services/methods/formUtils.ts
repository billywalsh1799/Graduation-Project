import { FormGroup } from "@angular/forms";

export function setCustomFormError(form:FormGroup,field:string,message:string) {
    const formControl = form.get(field);
    formControl?.setErrors({ customError: message }); // Set custom error for username
}

export function clearFormError(form:FormGroup,field:string) {
    const formControl = form.get(field);
    if (formControl?.errors?.['customError']) {
      formControl.setErrors(null); // Clear custom error
    }
}

export function validatePasswordConfirmation(form:FormGroup,password:string,confirmPassword:string) {

    const passwordControl = form.get(password);
    const confirmPasswordControl = form.get(confirmPassword);

    // Check if password and confirmPassword fields match
    const passwordsMatch = passwordControl?.value === confirmPasswordControl?.value;

    // Set custom error on confirmPassword control if passwords don't match
    if (!passwordsMatch) {
      confirmPasswordControl?.setErrors({ 'passwordMismatch': true });
    } else {
      confirmPasswordControl?.setErrors(null); // Clear custom error if passwords match
    }
}
