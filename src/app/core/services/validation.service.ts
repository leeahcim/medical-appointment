import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  /**
   * Validates if the person is an adult (18+) based on their birth number (rodné číslo)
   * Validates the format and calculates age based on Slovak/Czech birth number format
   */
  adultValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const birthNumber = control.value.replace('/', ''); // Remove potential slash

      // Basic format validation (length, digits only)
      if (!/^\d{9,10}$/.test(birthNumber)) {
        return { invalidFormat: true };
      }

      // Extract year, month, day from birth number
      let year = parseInt(birthNumber.substring(0, 2), 10);
      let month = parseInt(birthNumber.substring(2, 4), 10);
      const day = parseInt(birthNumber.substring(4, 6), 10);

      // Adjust year based on birth number format
      const currentYear = new Date().getFullYear();
      const century = currentYear - (currentYear % 100);

      // Determine birth century based on length and first digits
      if (birthNumber.length === 10) {
        // For numbers issued after 1954
        year = year + (year > 54 ? 1900 : 2000);
      } else {
        // For numbers issued before 1954
        year = year + 1900;
      }

      // Adjust month (in birth number, women have month+50)
      if (month > 50) {
        month -= 50;
      } else if (month > 20) {
        month -= 20;
      }

      // Validate month and day
      if (month < 1 || month > 12 || day < 1 || day > 31) {
        return { invalidDate: true };
      }

      // Calculate age
      const birthDate = new Date(year, month - 1, day);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();

      // Adjust age if birthday hasn't occurred yet this year
      if (
        today.getMonth() < birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() &&
          today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      return age >= 18 ? null : { notAdult: true };
    };
  }
}
