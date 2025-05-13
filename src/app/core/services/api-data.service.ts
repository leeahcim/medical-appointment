import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AvailableSlotsResponse,
  CompleteReservationResponse,
  SavePersonalDataResponse
} from '../models/api-responses.model';
import { PersonalData } from '../models/personal-data.model';

@Injectable({
  providedIn: 'root',
})
export class ApiDataService {
  private apiUrl = environment.api_url;

  constructor(private http: HttpClient) {}

  /**
   * Fetches available appointment slots from the API
   */
  getAvailableSlots(): Observable<AvailableSlotsResponse> {
    return this.http
      .get<AvailableSlotsResponse>(
        `${this.apiUrl}/available-slots`
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
        `${this.apiUrl}/save-personal-data`,
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
        `${this.apiUrl}/complete`,
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
