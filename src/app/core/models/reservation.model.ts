import { PersonalData } from './personal-data.model';
import { Slot } from './slot.model';

export interface Reservation {
  selectedSlot: Slot | null;
  personalData: PersonalData | null;
  agreements: {
    termsAndConditions: boolean;
    gdpr: boolean;
    marketing: boolean;
  };
  isComplete: boolean;
  isSuccessful?: boolean;
}
