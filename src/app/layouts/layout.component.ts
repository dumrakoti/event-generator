import { Component } from '@angular/core';

@Component({
  selector: 'app-layout',
  template: `
    <div class="tg-layout">
      <app-topbar />

      <div class="main-wrapper">
        <app-sidebar />

        <div class="content-wrapper">
          <div class="container mt-3">
            <router-outlet />

            <app-footer />
          </div>
        </div>
      </div>
    </div>
  `,
})

export class LayoutComponent {

}
