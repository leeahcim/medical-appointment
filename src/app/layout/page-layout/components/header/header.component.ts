import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ReservationService } from '../../../../core/services/reservation.service';
import { CancelReservationDialogComponent } from '../../../../features/reservation/components/cancel-reservation-dialog/cancel-reservation-dialog.component';

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
export class HeaderComponent implements OnInit, AfterViewInit {
  reservation = inject(ReservationService);
  dialog = inject(MatDialog);
  router = inject(Router);
  translate = inject(TranslateService);

  @ViewChild('stepper') stepper!: MatStepper;

  ngOnInit(): void {
    this.resloveTranslation();
  }

  ngAfterViewInit(): void {
    this.reservation.setStepper(this.stepper);
  }

  cancelReservation(): void {
    const dialog = this.dialog.open(CancelReservationDialogComponent, {
      width: '250px',
    });

    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.reservation.resetReservation();
        this.router.navigate(['/reservation/slot-selection']);
      }
    });
  }

  switchLanguage(lang: string) {
    this.translate.use(lang);
  }

  private resloveTranslation(): void {
    this.translate.addLangs(['en', 'de']);
    const browserLang = navigator.languages
      ? navigator.languages[0].split('-')[0]
      : navigator.language.split('-')[0];

    // Get the current browser language, if included set it
    const defaultLang = this.translate.getLangs().includes(browserLang)
      ? browserLang
      : 'en';

    // Set the default and current language
    this.translate.setDefaultLang(defaultLang);
  }
}
