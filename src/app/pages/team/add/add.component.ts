import { Component, inject } from '@angular/core';
import { FormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html'
})
export class AddComponent {
  private formBuilder = inject(UntypedFormBuilder);
  private title = inject(Title);
  private router = inject(Router);
  private ps = inject(FirebaseService);

  form: UntypedFormGroup | any;
  submitted: boolean = false;
  successMsg: string | any = '';
  errorMsg: string | any = '';

  constructor() {
    this.title.setTitle('Create Team | Team Generator');
    this.form = this.formBuilder.group({
      teams: this.formBuilder.array([], Validators.required)
    });

    this.addTeam();
  }

  postingTeam(): FormArray {
    return this.form.get('teams') as FormArray;
  }

  addTeam() {
    const teamGroup = this.formBuilder.group({
      name: ['', [Validators.required]]
    });
    this.postingTeam().push(teamGroup);
  }

  removeTeam(ind: number) {
    if (this.postingTeam().length === 1) return;
    this.postingTeam().removeAt(ind);
  }

  submit(fd: any) {
    if (this.form.invalid || this.submitted) {
      return;
    }

    this.submitted = true;
    const promises = fd.teams.map((pd: any) => this.ps.create('team', pd));
    Promise.all(promises)
      .then(() => {
        this.successMsg = 'New team added successfully!';
        this.submitted = false;
        this.form.reset();
        this.form.setControl('teams', this.formBuilder.array([]));
        this.addTeam();
        setTimeout(() => { this.router.navigate(['/team']); }, 1500);
      })
      .catch((error: any) => {
        this.errorMsg = error.message || 'Error adding new team';
        this.submitted = false;
      });
  }

}
