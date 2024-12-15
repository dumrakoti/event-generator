import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html'
})
export class EditComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private ps = inject(FirebaseService);
  private title = inject(Title);

  playerKey: string | null = null;
  playersByKeySubscription: Subscription | null = null;
  player: any;
  loader: boolean = false;
  errorMessage: string | null = null;

  constructor() {
    this.route.paramMap.subscribe((params) => {
      this.playerKey = params.get('key');
    });
  }

  ngOnInit(): void {
    this.title.setTitle('Edit Players | Team Generator');
    this.fetchPlayerByKey();
  }

  ngOnDestroy(): void {
    this.playersByKeySubscription?.unsubscribe();
  }

  fetchPlayerByKey() {
    this.loader = true;
    this.errorMessage = null;
    this.playersByKeySubscription = this.ps.getByKey('player', this.playerKey)
      .snapshotChanges()
      .subscribe({
        next: (snapshot: any) => {
          if (snapshot.payload.exists()) {
            this.player = { key: snapshot.key, ...snapshot.payload.val() };
          } else {
            this.errorMessage = 'Player not found.';
          }
          this.loader = false;
        },
        error: (err) => {
          this.errorMessage = 'Failed to load player data. Please try again later.';
          this.loader = false;
        },
      });
  }

}
