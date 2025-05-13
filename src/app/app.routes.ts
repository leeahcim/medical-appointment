import { Route } from '@angular/router';
import { ReservationFlowGuard } from './core/guards/reservation-flow.guard.service';



export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/page-layout/page-layout.component').then(
        (m) => m.PageLayoutComponent
      ),
    loadChildren: () => appointmentRoutes,
  },

  { path: '**', redirectTo: '' },
];

export const appointmentRoutes: Route[] = [
  {
    path: 'reservation',
    loadComponent: () =>
      import('./features/reservation/reservation.component').then(
        (m) => m.ReservationComponent
      ),
    loadChildren: () => reservationRoutes,
  },

  { path: '**', redirectTo: 'reservation' },
];

export const reservationRoutes: Route[] = [
  {
    path: 'slot-selection',
    loadComponent: () =>
      import(
        './features/reservation/components/slot-selection/slot-selection.component'
      ).then((m) => m.SlotSelectionComponent),
  },
  {
    path: 'personal-data',
    canActivate: [ReservationFlowGuard],
    loadComponent: () =>
      import(
        './features/reservation/components/personal-data/personal-data.component'
      ).then((m) => m.PersonalDataComponent),
  },

  {
    path: 'summary',
    canActivate: [ReservationFlowGuard],
    loadComponent: () =>
      import(
        './features/reservation/components/summary/summary.component'
      ).then((m) => m.SummaryComponent),
  },
  {
    path: 'success',
    canActivate: [ReservationFlowGuard],
    loadComponent: () =>
      import('./features/reservation/components/sucess/sucess.component').then(
        (m) => m.SucessComponent
      ),
  },

  { path: '**', redirectTo: 'slot-selection' },
];
