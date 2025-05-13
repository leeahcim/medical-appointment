import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NavigationStart, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { UnsubscribeController } from '../../core/utils/unsubscribe-controller';
import { ReservationService } from './services/reservation.service';

@Component({
  selector: 'ma-reservation',
  imports: [RouterModule, MatButtonModule, MatIconModule],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.scss',
})
export class ReservationComponent implements OnInit, OnDestroy {
  router = inject(Router);
  reservation = inject(ReservationService);

  showCancelModal = signal<boolean>(false);
  currentStep = signal<string>('');

  private unsub = new UnsubscribeController();

  ngOnInit(): void {
    // Listen to route changes to update current step
    this.unsub.sub = this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe((event: any) => {
        const path = event.url.split('/').pop();
        this.currentStep.set(this.getStepName(path));
      });

    // Initialize current step from URL
    const path = this.router.url.split('/').pop();
    this.currentStep.set(this.getStepName(path as string));

    // Handle browser back button
    window.onpopstate = () => {
      // Redirect to the first step when back button is pressed
      this.reservation.resetReservation();
      return false;
    };
  }

  private getStepName(path: string): string {
    switch (path) {
      case 'slot-selection':
        return 'Výber termínu';
      case 'personal-data':
        return 'Osobné údaje';
      case 'summary':
        return 'Zhrnutie rezervácie';
      case 'thank-you':
        return ''; // No step name on thank you page
      default:
        return 'Výber termínu';
    }
  }

  ngOnDestroy(): void {
    this.unsub.destroy();
  }
}
