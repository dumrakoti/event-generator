import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewComponent } from './view.component';
import { ViewUiModule } from '../../shared/view-ui/view-ui.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';

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
