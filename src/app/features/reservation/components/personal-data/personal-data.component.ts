import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ReservationService } from '../../../../core/services/reservation.service';
import { ValidationService } from '../../../../core/services/validation.service';
import { emailValidator } from '../../../../core/validators/validators';

@Component({
  selector: 'ma-personal-data',
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    TranslateModule
  ],
  templateUrl: './personal-data.component.html',
  styleUrl: './personal-data.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalDataComponent implements OnInit {
  fb = inject(FormBuilder);
  router = inject(Router);
  reservationService = inject(ReservationService);
  validationService = inject(ValidationService);

  personalDataForm!: FormGroup;
  submitting = signal<boolean>(false);
  submitError = signal<boolean>(false);
  submitErrorMessage = signal<string>('');

  countries = [
    { value: 'Slovakia', label: 'Slovensko' },
    { value: 'Czech Republic', label: 'Česká republika' },
  ];

  ngOnInit(): void {
    this.personalDataForm = this.createForm();

    // Check if we have existing personal data and prepopulate form
    this.reservationService.reservation$.subscribe((reservation) => {
      if (reservation.personalData) {
        this.personalDataForm.patchValue(reservation.personalData);
      }
    });

    // Handle country changes to toggle city field validation
    this.personalDataForm.get('country')?.valueChanges.subscribe((country) => {
      const cityControl = this.personalDataForm.get('city');

      if (country === 'Slovakia') {
        cityControl?.setValidators([Validators.required]);
      } else {
        cityControl?.clearValidators();
      }

      cityControl?.updateValueAndValidity();
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      personalId: [
        '',
        [Validators.required, this.validationService.adultValidator()],
      ],
      country: ['Slovakia', [Validators.required]],
      city: ['', [Validators.required]], // Initially required for Slovakia
      email: ['', [Validators.required, emailValidator()]],
    });
  }

  onSubmit(): void {
    if (this.personalDataForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.personalDataForm.controls).forEach((key) => {
        const control = this.personalDataForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.submitting.set(true);
    this.submitError.set(false);

    this.reservationService
      .savePersonalData(this.personalDataForm.value)
      .subscribe({
        next: (success) => {
          this.submitting.set(false);
          if (success) {
            this.router.navigate(['/reservation/summary']);

            this.reservationService.stepper?.next();
          } else {
            this.submitError.set(true);

            this.submitErrorMessage.set('Chyba pri ukladaní údajov');
          }
        },
        error: (err) => {
          this.submitting.set(false);
          console.error('Error submitting personal data:', err);
          this.submitError.set(true);
          this.submitErrorMessage.set(err);
        },
      });
  }

  // Helper getters for form controls
  get f(): { [key: string]: AbstractControl } {
    return this.personalDataForm.controls;
  }

  get showCity(): boolean {
    return this.personalDataForm.get('country')?.value === 'Slovakia';
  }

  get isPersonalIdInvalid(): boolean {
    const control = this.f['personalId'];
    return control.touched && control.invalid;
  }

  get personalIdErrorMessage(): string {
    const control = this.f['personalId'];

    if (control.errors?.['required']) {
      return 'Rodné číslo je povinné';
    } else if (control.errors?.['invalidFormat']) {
      return 'Neplatný formát rodného čísla';
    } else if (control.errors?.['invalidDate']) {
      return 'Neplatný dátum v rodnom čísle';
    } else if (control.errors?.['notAdult']) {
      return 'Služba je dostupná len pre osoby nad 18 rokov';
    }

    return 'Neplatné rodné číslo';
  }

  get isEmailInvalid(): boolean {
    const control = this.f['email'];
    return control.touched && control.invalid;
  }

  get emailErrorMessage(): string {
    const control = this.f['email'];

    if (control.errors?.['required']) {
      return 'E-mail je povinný';
    } else if (control.errors?.['invalidEmail']) {
      return 'Neplatný formát e-mailovej adresy';
    } else if (control.errors?.['testFailEmail']) {
      return 'Tento e-mail nemôže byť použitý';
    }

    return 'Neplatná e-mailová adresa';
  }
}
