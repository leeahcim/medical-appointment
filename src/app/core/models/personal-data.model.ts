export interface PersonalData {
  firstName: string;
  lastName: string;
  personalId: string; 
  country: 'Slovakia' | 'Czech Republic';
  city?: string;  
  email: string;
}