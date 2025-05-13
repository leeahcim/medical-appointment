import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { Reservation } from '../../../../core/models/reservation.model';
import {
  slideInRightOnEnterAnimation,
  slideInUpOnEnterAnimation,
} from '../../../../core/services/animations.service';
import { ReservationService } from '../../services/reservation.service';

@Component({
  selector: 'ma-summary',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule,
  ],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slideInRightOnEnterAnimation(), slideInUpOnEnterAnimation()],
  providers: [DatePipe],
})
export class SummaryComponent implements OnInit {
  fb = inject(FormBuilder);
  router = inject(Router);
  reservationService = inject(ReservationService);

  reservation$!: Observable<Reservation>;
  agreementsForm!: FormGroup;
  submitting = signal(false);

  ngOnInit(): void {
    this.reservation$ = this.reservationService.reservation$;
    this.agreementsForm = this.createForm();

    // Check if we have existing agreements and prepopulate form
    this.reservationService.reservation$.subscribe((reservation) => {
      if (reservation.agreements) {
        this.agreementsForm.patchValue({
          termsAndConditions: reservation.agreements.termsAndConditions,
          gdpr: reservation.agreements.gdpr,
          marketing: reservation.agreements.marketing,
        });
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      termsAndConditions: [false, [Validators.requiredTrue]],
      gdpr: [false, [Validators.requiredTrue]],
      marketing: [false], // Optional
    });
  }

  onSubmit(): void {
    if (this.agreementsForm.invalid) {
      Object.keys(this.agreementsForm.controls).forEach((key) => {
        const control = this.agreementsForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.submitting.set(true);

    this.reservationService
      .completeReservation(this.agreementsForm.value)
      .subscribe({
        next: (success) => {
          this.submitting.set(false);
          // We navigate to success in any case, as it handles both success and error
          this.router.navigate(['/reservation/success']);
        },
        error: () => {
          this.submitting.set(false);
          this.router.navigate(['/reservation/success']);
        },
      });
  }
}
