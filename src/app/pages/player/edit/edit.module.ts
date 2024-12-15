import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { EditComponent } from './edit.component';
import { EditUiModule } from '../../shared/edit-ui/edit-ui.module';

@NgModule({
  declarations: [EditComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: EditComponent }]),
    EditUiModule
  ]
})
export class EditModule { }

