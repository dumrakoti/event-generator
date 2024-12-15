import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-view-ui',
  templateUrl: './view-ui.component.html'
})
export class ViewUiComponent {
  private dialog = inject(MatDialog);

  @Input() slug: any;
  @Input() data: any;
  @Output() confirmStatus = new EventEmitter();

  remove(data: any): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '30%',
      autoFocus: false,
      disableClose: true,
      panelClass: ['rounded-xl', 'tm-dialog'],
      data: { data, slug: this.slug }
    });

    ref.afterClosed().subscribe((result: any) => {
      if (result) { this.confirmStatus.emit(true); }
    });
  }

}
