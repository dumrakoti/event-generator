import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { ViewComponent } from './view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmDialogModule } from '../../shared/confirm-dialog/confirm-dialog.module';
import { MatDialogModule } from '@angular/material/dialog';
import { ViewUiModule } from '../../shared/view-ui/view-ui.module';

@NgModule({
  declarations: [ViewComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: ViewComponent }]),
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    ViewUiModule
  ]
})
export class ViewModule { }

