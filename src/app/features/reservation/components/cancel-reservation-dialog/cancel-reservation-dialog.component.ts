import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'ma-cancel-reservation-dialog',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './cancel-reservation-dialog.component.html',
  styleUrl: './cancel-reservation-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CancelReservationDialogComponent {
  readonly dialogRef = inject(MatDialogRef<CancelReservationDialogComponent>);
  submitCancel() {
    this.dialogRef.close(true);
  }
}
