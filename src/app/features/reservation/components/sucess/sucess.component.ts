import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  slideInRightOnEnterAnimation,
  slideInUpOnEnterAnimation,
} from '../../../../core/services/animations.service';
import { ReservationService } from '../../services/reservation.service';

@Component({
  selector: 'ma-sucess',
  imports: [CommonModule, MatIconModule, MatButtonModule, TranslateModule],
  templateUrl: './sucess.component.html',
  styleUrl: './sucess.component.scss',
  animations: [slideInRightOnEnterAnimation(), slideInUpOnEnterAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SucessComponent {
  reservation = inject(ReservationService);
  router = inject(Router);


  goToHospitalSite(): void {
    this.reservation.navigateToHospitalSite();
  }

  startNewReservation(): void {
    this.reservation.startNewReservation();
  }
}
