import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { map, Observable, take } from 'rxjs';
import { ReservationService } from '../../features/reservation/services/reservation.service';

@Injectable({
  providedIn: 'root',
})
export class ReservationFlowGuard implements CanActivate {
  constructor(
    private reservationService: ReservationService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    const targetStep = route.routeConfig?.path || '';

    return this.reservationService.reservation$.pipe(
      take(1),
      map((reservation) => {
        const canProceed = this.reservationService.canProceedTo(targetStep);
        if (!canProceed) {
          // Determine appropriate redirection based on reservation state
          if (!reservation.selectedSlot) {
            this.router.navigate(['/reservation/slot-selection']);
          } else if (!reservation.personalData) {
            this.router.navigate(['/reservation/personal-data']);
          } else if (!reservation.isComplete) {
            this.router.navigate(['/reservation/summary']);
          }
        }

        return canProceed;
      })
    );
  }
}
