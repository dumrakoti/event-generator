import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Player } from 'src/app/models/player.model';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html'
})
export class ViewComponent implements OnInit, OnDestroy {
  private title = inject(Title);
  private ps = inject(FirebaseService);

  teamsSubscription: Subscription | null = null;
  teamsData: Player[] | any = [];
  teamsLoader: boolean = false;
  errorMessage: string | null = null;

  constructor() {
    this.title.setTitle('Teams | Team Generator');
  }

  ngOnInit(): void {
    this.fetchTeams();
  }

  ngOnDestroy(): void {
    this.teamsSubscription?.unsubscribe();
  }

  fetchTeams(): void {
    this.teamsLoader = true;
    this.errorMessage = null;

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
        this.errorMessage = 'Failed to load teams. Please try again later.';
        console.error('Error fetching teams:', err);
        this.teamsLoader = false;
      },
    });
  }

  confirmStatus(event: any) {
    if (event) { this.fetchTeams(); }
  }
}
