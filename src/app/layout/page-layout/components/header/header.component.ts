import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  inject,
  ViewChild
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LANGUAGES, TranslateLangService } from '../../../../core/services/translate.service';
import { CancelReservationDialogComponent } from '../../../../features/reservation/components/cancel-reservation-dialog/cancel-reservation-dialog.component';
import { ReservationService } from '../../../../features/reservation/services/reservation.service';

@Component({
  selector: 'ma-header',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    TranslateModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements  AfterViewInit {
  reservation = inject(ReservationService);
  dialog = inject(MatDialog);
  router = inject(Router);
  translate = inject(TranslateLangService);

  langualges = LANGUAGES;

  @ViewChild('stepper') stepper!: MatStepper;

  ngAfterViewInit(): void {
    this.reservation.setStepper(this.stepper);
  }

  cancelReservation(): void {
    const dialog = this.dialog.open(CancelReservationDialogComponent, {
      width: '640px',
    });

    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.reservation.resetReservation();
      }
    });
  }

}
