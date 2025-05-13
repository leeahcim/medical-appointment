import { TestBed } from '@angular/core/testing';

import { ReservationFactoryService } from './reservation.factory.service';

describe('ReservationFactoryService', () => {
  let service: ReservationFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReservationFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
