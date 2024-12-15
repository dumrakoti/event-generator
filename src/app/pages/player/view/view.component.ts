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

  playersSubscription: Subscription | null = null;
  playersData: Player[] | any = [];
  playersLoader: boolean = false;
  errorMessage: string | null = null;

  constructor() {
    this.title.setTitle('Players | Team Generator');
  }

  ngOnInit(): void {
    this.fetchPlayers();
  }

  ngOnDestroy(): void {
    this.playersSubscription?.unsubscribe();
  }

  fetchPlayers(): void {
    this.playersLoader = true;
    this.errorMessage = null;

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
        this.errorMessage = 'Failed to load players. Please try again later.';
        console.error('Error fetching players:', err);
        this.playersLoader = false;
      },
    });
  }

  confirmStatus(event: any) {
    if (event) { this.fetchPlayers(); }
  }
}
