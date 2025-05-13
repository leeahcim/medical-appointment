import { inject, Injectable } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { PersonalData } from '../../../core/models/personal-data.model';
import { Reservation } from '../../../core/models/reservation.model';
import { Slot } from '../../../core/models/slot.model';
import { ApiDataService } from './reservation-data.service';
import { ReservationFactoryService } from './reservation.factory.service';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  factory = inject(ReservationFactoryService);
  data = inject(ApiDataService);
  router = inject(Router);

  // Initialize empty reservation state
  private initialState: Reservation = {
    selectedSlot: null,
    personalData: null,
    agreements: {
      termsAndConditions: false,
      gdpr: false,
      marketing: false,
    },
    isComplete: false,
  };

  // BehaviorSubject to track reservation state
  private reservationState = new BehaviorSubject<Reservation>(
    this.initialState
  );

  // Observable for components to subscribe to
  public reservation$ = this.reservationState.asObservable();

  // BehaviorSubject for available slots
  private availableSlotsSubject = new BehaviorSubject<Slot[]>([]);
  public availableSlots$ = this.availableSlotsSubject.asObservable();

  public stepper!: MatStepper;


  /**
   * Save stepper reference for navigation
   */
  setStepper(stepper: MatStepper): void {
    this.stepper = stepper;
  }

  /**
   * Reset the reservation process
   */
  resetReservation(): void {
    this.reservationState.next(this.initialState);
  }

  /**
   * Fetch available slots from API
   */
  fetchAvailableSlots(): Observable<Slot[]> {
    return this.data.getAvailableSlots().pipe(
      tap((response) => {
        if (response?.slots) {
          this.availableSlotsSubject.next(
            this.factory.parseSlots(response.slots)
          );
        }
      }),
      switchMap((response) => {
        if (response?.slots) {
          return of(this.factory.parseSlots(response.slots));
        }
        return of([]);
      }),
      catchError((error) => {
        console.error('Error fetching slots:', error);
        return of([]);
      })
    );
  }

  /**
   * Select a slot and save it
   */
  selectSlot(slot: Slot): Observable<boolean> {
    const currentState = this.reservationState.value;

    // Update state
    this.reservationState.next({
      ...currentState,
      selectedSlot: slot,
    });

    // In a real app, we might want to reserve this slot on the backend
    // Return Observable<boolean> to indicate success
    return of(true);
  }

  /**
   * Save personal data and proceed to next step
   */
  savePersonalData(personalData: PersonalData): Observable<boolean> {
    return this.data.savePersonalData(personalData).pipe(
      tap((response) => {
        if (response.reservationId) {
          const currentState = this.reservationState.value;
          this.reservationState.next({
            ...currentState,
            personalData: personalData,
          });
        }
      }),
      switchMap((response) => of(!!response.reservationId)),
      catchError((err) => {
        return of(false);
      })
    );
  }

  /**
   * Complete the reservation process
   */
  completeReservation(agreements: any): Observable<boolean> {
    const currentState = this.reservationState.value;

    if (!currentState.selectedSlot) {
      return of(false);
    }

    return this.data
      .completeReservation(currentState.selectedSlot.id, agreements)
      .pipe(
        tap((response) => {
          const isSuccessful = !!response.slotId;
          this.reservationState.next({
            ...currentState,
            agreements: agreements,
            isComplete: true,
            isSuccessful: isSuccessful,
          });
        }),
        switchMap((response) => of(!!response.slotId)),
        catchError((error) => {
          console.error('Error completing reservation:', error);
          // Still mark as complete but not successful
          this.reservationState.next({
            ...currentState,
            agreements: agreements,
            isComplete: true,
            isSuccessful: false,
          });
          return of(false);
        })
      );
  }

  /**
   * Navigate to hospital website on successful completion
   */
  navigateToHospitalSite(): void {
    window.location.href = 'https://nemocnicabory.sk';
  }

  /**
   * Start a new reservation process
   */
  startNewReservation(): void {
    this.resetReservation();
    this.router.navigate(['/reservation/slot-selection']);
  }

  /**
   * Check if user can proceed to a specific step based on previous steps completion
   */
  canProceedTo(step: string): boolean {
    const state = this.reservationState.value;

    switch (step) {
      case 'personal-data':
        return !!state.selectedSlot;
      case 'summary':
        return !!state.selectedSlot && !!state.personalData;
      case 'thank-you':
        return !!state.selectedSlot && !!state.personalData && state.isComplete;
      default:
        return true;
    }
  }
}