import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ReservationService } from '../../../../core/services/reservation.service';

@Component({
  selector: 'ma-sucess',
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './sucess.component.html',
  styleUrl: './sucess.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SucessComponent implements OnInit {
  reservation = inject(ReservationService);
  router = inject(Router);

  isSuccessful = false;

  ngOnInit(): void {
    // Check reservation success status
    this.reservation.reservation$.subscribe((reservation) => {
      this.isSuccessful = !!reservation.isSuccessful;
    });
  }

  goToHospitalSite(): void {
    this.reservation.navigateToHospitalSite();
  }

  startNewReservation(): void {
    this.reservation.startNewReservation();
  }
}
