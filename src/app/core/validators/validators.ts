import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Email validator with more comprehensive validation than the standard pattern
 */
export function emailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    // Comprehensive email regex pattern
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailPattern.test(control.value)) {
      return { invalidEmail: true };
    }

    return null;
  };
}
