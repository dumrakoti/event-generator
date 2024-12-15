import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewUiComponent } from './view-ui.component';
import { ConfirmDialogModule } from '../confirm-dialog/confirm-dialog.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ViewUiComponent],
  exports: [ViewUiComponent],
  imports: [
    CommonModule,
    RouterModule,
    ConfirmDialogModule
  ]
})
export class ViewUiModule { }
