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

  teamKey: string | null = null;
  teamsByKeySubscription: Subscription | null = null;
  team: any;
  loader: boolean = false;
  errorMessage: string | null = null;

  constructor() {
    this.route.paramMap.subscribe((params) => {
      this.teamKey = params.get('key');
    });
  }

  ngOnInit(): void {
    this.title.setTitle('Edit Team | Team Generator');
    this.fetchTeamByKey();
  }

  ngOnDestroy(): void {
    this.teamsByKeySubscription?.unsubscribe();
  }

  fetchTeamByKey() {
    this.loader = true;
    this.errorMessage = null;
    this.teamsByKeySubscription = this.ps.getByKey('team', this.teamKey)
      .snapshotChanges()
      .subscribe({
        next: (snapshot: any) => {
          if (snapshot.payload.exists()) {
            this.team = { key: snapshot.key, ...snapshot.payload.val() };
          } else {
            this.errorMessage = 'Team not found.';
          }
          this.loader = false;
        },
        error: (err) => {
          this.errorMessage = 'Failed to load team data. Please try again later.';
          this.loader = false;
        },
      });
  }
}
