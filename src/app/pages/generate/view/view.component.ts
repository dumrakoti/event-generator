import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Player } from 'src/app/models/player.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent {
  private title = inject(Title);
  private ps = inject(FirebaseService);

  teamParticipantSubscription: Subscription | null = null;
  teamParticipantData: Player[] | any = [];
  teamParticipantLoader: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  public env = environment;

  copied: boolean = false;

  constructor() {
    this.title.setTitle('Team & Participant | Team Generator');
  }

  ngOnInit(): void {
    this.fetchData();
  }

  ngOnDestroy(): void {
    this.teamParticipantSubscription?.unsubscribe();
  }

  fetchData(): void {
    this.teamParticipantLoader = true;
    this.errorMessage = null;

    this.teamParticipantSubscription = this.ps.getAll('team-generate').snapshotChanges().pipe(
      map((changes: any) =>
        changes.map((c: any) => ({
          key: c.payload.key,
          ...c.payload.val(),
        }))
      )
    ).subscribe({
      next: (data: Player[]) => {
        this.teamParticipantData = data;
        this.teamParticipantLoader = false;
      },
      error: (err: any) => {
        this.errorMessage = 'Failed to load team and participant. Please try again later.';
        console.error('Error fetching team and participant:', err);
        this.teamParticipantLoader = false;
      },
    });
  }

  confirmStatus(event: any) {
    if (event) { this.fetchData(); }
  }

  copyLink(key: any): void {
    const link = this.env.baseUrl + '/' + key;
    navigator.clipboard.writeText(link).then(() => {
      this.copied = true;
      setTimeout(() => { this.copied = false; }, 1500);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  }

  getPlayerSkillCount(players: any[]): number {
    if (!players || players.length === 0) {
      return 0;
    }
    return players.reduce((total, player) => total + (player.skill || 0), 0);
  }

  deleteEvent(evObj: any) {
    this.ps.deleteByKey('team-generate', evObj.key).then(() => {
      this.successMessage = `${evObj.name} event deleted successfully.`;
      setTimeout(() => { this.successMessage = ''; }, 1500);
    }).catch(err => {
      this.errorMessage = `Failed to delete ${evObj.name} player. Please try again.`;
    });
  }


}
