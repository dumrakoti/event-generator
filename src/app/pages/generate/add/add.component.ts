import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormArray } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subscription, map } from 'rxjs';
import { Player } from 'src/app/models/player.model';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit, OnDestroy {
  private formBuilder = inject(UntypedFormBuilder);
  private title = inject(Title);
  private router = inject(Router);
  private ps = inject(FirebaseService);

  form: UntypedFormGroup | any;
  submitted: boolean = false;
  successMsg: string | any = '';
  errorMsg: string | any = '';

  playersSubscription: Subscription | null = null;
  playersData: Player[] | any = [];
  playersLoader: boolean = false;

  teamsSubscription: Subscription | null = null;
  teamsData: Player[] | any = [];
  teamsLoader: boolean = false;

  constructor() {
    this.title.setTitle('Create Team & Participant | Team Generator');
  }

  ngOnInit() {
    this.fetchPlayers();
    this.fetchTeams();
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      participants: this.formBuilder.array([], Validators.required)
    });

    this.addTeam();
  }

  ngOnDestroy(): void {
    this.playersSubscription?.unsubscribe();
    this.teamsSubscription?.unsubscribe();
  }

  fetchPlayers(): void {
    this.playersLoader = true;
    this.playersSubscription = this.ps.getAll('player').snapshotChanges().pipe(
      map((changes: any) =>
        changes.map((c: any) => ({
          key: c.payload.key,
          ...c.payload.val(),
        }))
      )
    ).subscribe({
      next: (data: Player[]) => {
        this.playersData = data;
        this.playersLoader = false;
      },
      error: (err: any) => {
        this.playersLoader = false;
      },
    });
  }

  fetchTeams(): void {
    this.teamsLoader = true;
    this.teamsSubscription = this.ps.getAll('team').snapshotChanges().pipe(
      map((changes: any) =>
        changes.map((c: any) => ({
          key: c.payload.key,
          ...c.payload.val(),
        }))
      )
    ).subscribe({
      next: (data: Player[]) => {
        this.teamsData = data;
        this.teamsLoader = false;
      },
      error: (err: any) => {
        this.teamsLoader = false;
      },
    });
  }

  postingTeam(): FormArray {
    return this.form.get('participants') as FormArray;
  }

  addTeam() {
    const tg = this.formBuilder.group({
      team: [null, [Validators.required]],
      players: [null, [Validators.required]]
    });
    this.postingTeam().push(tg);
  }

  removePlayer(ind: number) {
    if (this.postingTeam().length === 1) return;
    this.postingTeam().removeAt(ind);
  }

  get f() { return this.form.controls; }

  getSelectedPlayers(): any[] {
    const selectedPlayers: any[] = [];
    this.postingTeam().controls.forEach((teamGroup: UntypedFormGroup | any) => {
      const players = teamGroup.get('players').value || [];
      selectedPlayers.push(...players);
    });
    return selectedPlayers.map(player => player.key);
  }

  isPlayerDisabled(playerKey: string): boolean {
    const selectedPlayerKeys = this.getSelectedPlayers();
    return selectedPlayerKeys.includes(playerKey);
  }

  submit(fd: any) {
    console.log('fd', fd);
    if (this.form.invalid || this.submitted) {
      return;
    }
    this.validateSkills();
    if (this.form.errors?.skillMismatch) { return; }

    this.submitted = true;
    this.ps.create('team-generate', fd).then(() => {
      this.successMsg = 'New futsal participant added successfully!';
      this.submitted = false;
      this.form.reset();
      this.form.setControl('participants', this.formBuilder.array([]));
      this.addTeam();
      setTimeout(() => { this.router.navigate(['/event']); }, 1500);
    }).catch((error: any) => {
      this.errorMsg = error.message || 'Error adding new futsal participant';
      this.submitted = false;
    });
  }

  validateSkills(): void {
    const participants = this.postingTeam().controls;
    const skillCounts = participants.map((participant: any) => {
      const selectedPlayers = participant ? participant.get('players').value : [];
      if (selectedPlayers) {
        return selectedPlayers.reduce((total: number, player: any) => {
          const playerData = this.playersData.find((p: any) => p.key === player.key);
          return total + (playerData?.skill || 0);
        }, 0);
      }
    });

    const allSkillsMatch = skillCounts.every((count) => count === skillCounts[0]);
    if (!allSkillsMatch) {
      this.form.setErrors({ skillMismatch: true });
    } else {
      this.form.setErrors(null);
    }
  }

  getPlayerSkillsCount(index: number): any {
    const participants: any = this.postingTeam();
    const selectedPlayers = participants ? participants.at(index).get('players').value : [];
    if (selectedPlayers) {
      return selectedPlayers.reduce((total: number, player: any) => {
        const playerData = this.playersData.find((p: any) => p.key === player.key);
        return total + (playerData?.skill || 0);
      }, 0);
    } else {
      return 0;
    }
  }

}
