import { Injectable } from '@angular/core';
import { Slot } from '../../../core/models/slot.model';
import { SlotGroup } from '../components/slot-selection/slot-selection.component';

@Injectable({
  providedIn: 'root'
})
export class ReservationFactoryService {

  groupSlotsByDate(slots: Slot[]): SlotGroup[] {
    // Reset grouped slots
    const groupedSlots: SlotGroup[] = [];

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
      groupedSlots.push({
        date: date,
        slots: groupedByDate[date],
      });
    });

    // Sort by date
    groupedSlots.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return groupedSlots;
  }


  parseSlots(
    json: Record<string, { id: string; time: string }[]>
  ): Slot[] {
    const slots: Slot[] = [];

    for (const [date, entries] of Object.entries(json)) {
      for (const entry of entries) {
        slots.push({
          id: entry.id,
          date: date,
          time: entry.time,
        });
      }
    }

    return slots;
  }
}
