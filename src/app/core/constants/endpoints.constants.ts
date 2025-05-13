import { environment } from '../../../environments/environment';

// API URL from environment configuration
const API_URL = environment.api_url;

export function getEndpointName(endpointPath: string): string {
  return API_URL + endpointPath;
}

export const API_ENDPOINTS = {
  RESERVATION: {
    GET_AVAILABLE_SLOTS: '/available-slots',
    SAVE_PERSONAL_DATA: '/save-personal-data',
    COMPLETE_RESERVATION: '/complete',
  },
};
