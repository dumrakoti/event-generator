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
    this.title.setTitle('Create Players | Team Generator');
    this.form = this.formBuilder.group({
      players: this.formBuilder.array([], Validators.required)
    });

    this.addPlayer();
  }

  postingPlayer(): FormArray {
    return this.form.get('players') as FormArray;
  }

  addPlayer() {
    const playerGroup = this.formBuilder.group({
      name: ['', [Validators.required]],
      skill: [null, [Validators.required]]
    });
    this.postingPlayer().push(playerGroup);
  }

  removePlayer(ind: number) {
    if (this.postingPlayer().length === 1) return;
    this.postingPlayer().removeAt(ind);
  }

  submit(fd: any) {
    if (this.form.invalid || this.submitted) {
      return;
    }

    this.submitted = true;
    const promises = fd.players.map((pd: any) => this.ps.create('player', pd));
    Promise.all(promises)
      .then(() => {
        this.successMsg = 'New participant added successfully!';
        this.submitted = false;
        this.form.reset();
        this.form.setControl('players', this.formBuilder.array([]));
        this.addPlayer();
        setTimeout(() => {
          this.router.navigate(['/player']);
        }, 1500);
      })
      .catch((error: any) => {
        this.errorMsg = error.message || 'Error adding new participant';
        this.submitted = false;
      });
  }
}
