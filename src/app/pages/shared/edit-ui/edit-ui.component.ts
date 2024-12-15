import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-edit-ui',
  templateUrl: './edit-ui.component.html'
})
export class EditUiComponent {
  private ps = inject(FirebaseService);
  private router = inject(Router);

  @Input() slug: any;
  @Input() data: any;

  submitted: boolean | any = false;
  statusMessage: string = '';

  submit() {
    if (this.data.name === '' || this.submitted) {
      return;
    }
    this.statusMessage = '';
    this.submitted = true;
    let { key, ...newObj } = this.data;
    console.log('newObj', newObj);
    this.ps.updateByKey(this.slug, this.data.key, newObj).then(() => {
      this.statusMessage = `New ${this.slug === 'player' ? 'participant' : 'team'} added successfully!`;
      this.submitted = false;
      setTimeout(() => { this.router.navigate([this.slug]); }, 1500);
    }).catch((error: any) => {
      this.statusMessage = error.message || `Error adding new ${this.slug === 'player' ? 'participant' : 'team'}`;
      this.submitted = false;
    });
  }

}
