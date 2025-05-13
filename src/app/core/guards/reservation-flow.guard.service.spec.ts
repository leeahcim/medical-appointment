import { TestBed } from '@angular/core/testing';

import { ReservationFlowGuardService } from './reservation-flow.guard.service';

describe('ReservationFlowGuardService', () => {
  let service: ReservationFlowGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReservationFlowGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
