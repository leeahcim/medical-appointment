import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  model,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import {
  MatCalendarCellClassFunction,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { Slot } from '../../../../core/models/slot.model';
import { slideInRightOnEnterAnimation, slideInUpOnEnterAnimation } from '../../../../core/services/animations.service';
import { UnsubscribeController } from '../../../../core/utils/unsubscribe-controller';
import { ReservationFactoryService } from '../../services/reservation.factory.service';
import { ReservationService } from '../../services/reservation.service';

export interface SlotGroup {
  date: string;
  slots: Slot[];
}

@Component({
  selector: 'ma-slot-selection',
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    TranslateModule,
  ],
  templateUrl: './slot-selection.component.html',
  styleUrl: './slot-selection.component.scss',
  providers: [provideNativeDateAdapter()],
  animations: [slideInRightOnEnterAnimation(), slideInUpOnEnterAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlotSelectionComponent implements OnInit, OnDestroy {
  reservationService = inject(ReservationService);
  reservationFactory = inject(ReservationFactoryService);
  router = inject(Router);

  slots$!: Observable<Slot[]>;
  selectedSlotId = signal<string | null>(null);
  loading = signal<boolean>(false);
  error = signal<boolean>(false);

  private unsub = new UnsubscribeController();

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    // Only highligh dates inside the month view.
    if (view === 'month') {
      const date = cellDate;

      // Highlight the 1st and 20th day of each month.
      return this.groupedSlots.some((group) => {
        return (
          new Date(group.date).toISOString() === new Date(date).toISOString()
        );
      })
        ? 'has-terms'
        : '';
    }

    return '';
  };

  selectedDate = model<Date>(new Date());
  timesForDate = computed(() => {
    return (
      this.groupedSlots.find((group) => {
        return (
          new Date(group.date).toISOString() ===
          new Date(this.selectedDate()).toISOString()
        );
      })?.slots || []
    );
  });

  // Grouped slots by date for UI rendering
  groupedSlots: SlotGroup[] = [];

  ngOnInit(): void {
    this.slots$ = this.reservationService.availableSlots$;

    // Load available slots
    this.loadSlots();

    // Subscribe to current reservation state
    this.unsub.sub = this.reservationService.reservation$.subscribe(
      (reservation) => {
        if (reservation.selectedSlot) {
          this.selectedSlotId.set(reservation.selectedSlot.id);
        }
      }
    );
  }

  loadSlots(): void {
    this.loading.set(true);
    this.error.set(false);

    this.reservationService.fetchAvailableSlots().subscribe({
      next: (slots) => {
        this.groupedSlots = this.reservationFactory.groupSlotsByDate(slots);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading slots:', err);
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  selectSlot(slot: Slot): void {
    this.selectedSlotId.set(slot.id);
    this.reservationService.selectSlot(slot).subscribe();
  }

  continueToNextStep(): void {
    if (this.selectedSlotId()) {
      this.router.navigate(['/reservation/personal-data']);
      this.reservationService.stepper?.next();
    }
  }

  retryLoading(): void {
    this.loadSlots();
  }

  ngOnDestroy(): void {
    this.unsub.destroy();
  }
}
