import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import {
  API_ENDPOINTS,
  getEndpointName,
} from '../../../core/constants/endpoints.constants';
import {
  AvailableSlotsResponse,
  CompleteReservationResponse,
  SavePersonalDataResponse,
} from '../../../core/models/api-responses.model';
import { PersonalData } from '../../../core/models/personal-data.model';

@Injectable({
  providedIn: 'root',
})
export class ApiDataService {
  http = inject(HttpClient);

  /**
   * Fetches available appointment slots from the API
   */
  getAvailableSlots(): Observable<AvailableSlotsResponse> {
    return this.http
      .get<AvailableSlotsResponse>(
        getEndpointName(API_ENDPOINTS.RESERVATION.GET_AVAILABLE_SLOTS)
      )
      .pipe(catchError((error) => this.handleError(error)));
  }

  /**
   * Saves personal data for the reservation
   */
  savePersonalData(
    personalData: PersonalData
  ): Observable<SavePersonalDataResponse> {
    return this.http
      .post<SavePersonalDataResponse>(
        getEndpointName(API_ENDPOINTS.RESERVATION.SAVE_PERSONAL_DATA),
        personalData
      )
      .pipe(catchError((error) => this.handleError(error)));
  }

  /**
   * Completes the reservation process
   */
  completeReservation(
    slotId: string,
    agreements: any
  ): Observable<CompleteReservationResponse> {
    return this.http
      .post<CompleteReservationResponse>(
        getEndpointName(API_ENDPOINTS.RESERVATION.COMPLETE_RESERVATION),
        { id: slotId, agreements }
      )
      .pipe(catchError((error) => this.handleError(error)));
  }

  /**
   * Global error handler for HTTP requests
   */
  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    return throwError(() => new Error(error.message || 'Server error'));
  }
}
