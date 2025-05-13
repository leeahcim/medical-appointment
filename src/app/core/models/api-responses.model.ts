export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface AvailableSlotsResponse {
  slots: Record<string, { id: string; time: string }[]>;
}

export interface SavePersonalDataResponse {
  message: string;
  reservationId: string;
  timestamp: string;
}

export interface CompleteReservationResponse {
  message: string;
  slotId: string;
  confirmedAt: string;
}
