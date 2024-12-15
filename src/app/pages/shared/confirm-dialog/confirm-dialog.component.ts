import { Component, inject, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html'
})
export class ConfirmDialogComponent {
  private ps = inject(FirebaseService);

  errorMessage: any;
  successMessage: any;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  closeDialog(flg: any): void {
    this.dialogRef.close(flg);
  }

  removePlayer() {
    this.ps.deleteByKey(this.data.slug, this.data.data.key)
      .then(() => {
        this.successMessage = `${this.data.data.name} player deleted successfully.`;
        setTimeout(() => { this.closeDialog(true); }, 0);
      })
      .catch(err => {
        this.errorMessage = `Failed to delete ${this.data.data.name} player. Please try again.`;
      });
  }

}
