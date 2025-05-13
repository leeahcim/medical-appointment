import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  model,
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
import { ReservationService } from '../../../../core/services/reservation.service';

@Component({
  selector: 'ma-slot-selection',
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    TranslateModule
  ],
  templateUrl: './slot-selection.component.html',
  styleUrl: './slot-selection.component.scss',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlotSelectionComponent implements OnInit {
  reservationService = inject(ReservationService);
  router = inject(Router);

  slots$!: Observable<Slot[]>;
  selectedSlotId = signal<string | null>(null);
  loading = signal<boolean>(false);
  error = signal<boolean>(false);

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    // Only highligh dates inside the month view.
    if (view === 'month') {
      const date = cellDate;

      // Highlight the 1st and 20th day of each month.
      return this.groupedSlots.some(group => {
        return  new Date(group.date).toISOString() ===
          new Date(date).toISOString()
      }
      ) ? 'has-terms' : '';
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
  groupedSlots: { date: string; slots: Slot[] }[] = [];

  ngOnInit(): void {
    this.slots$ = this.reservationService.availableSlots$;

    // Load available slots
    this.loadSlots();

    // Subscribe to current reservation state
    this.reservationService.reservation$.subscribe((reservation) => {
      if (reservation.selectedSlot) {
        this.selectedSlotId.set(reservation.selectedSlot.id);
      }
    });
  }

  loadSlots(): void {
    this.loading.set(true);
    this.error.set(false);

    this.reservationService.fetchAvailableSlots().subscribe({
      next: (slots) => {
        this.groupSlotsByDate(slots);

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

  private groupSlotsByDate(slots: Slot[]): void {
    // Reset grouped slots
    this.groupedSlots = [];

    // Group slots by date
    const groupedByDate = slots.reduce(
      (groups: { [key: string]: Slot[] }, slot) => {
        const date = new Date(slot.date).toISOString();
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(slot);
        return groups;
      },
      {}
    );

    // Convert to array format for template
    Object.keys(groupedByDate).forEach((date) => {
      this.groupedSlots.push({
        date: date,
        slots: groupedByDate[date],
      });
    });

    // Sort by date
    this.groupedSlots.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }
}
