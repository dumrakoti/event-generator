import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layouts/layout.component';

const routes: Routes = [
  { path: '', redirectTo: 'player', pathMatch: 'full' },
  {
    path: 'player',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'view', pathMatch: 'full' },
      { path: 'view', loadChildren: () => import('./pages/player/view/view.module').then(m => m.ViewModule) },
      { path: 'add', loadChildren: () => import('./pages/player/add/add.module').then(m => m.AddModule) },
      { path: ':key', loadChildren: () => import('./pages/player/edit/edit.module').then(m => m.EditModule) },
      { path: '**', redirectTo: 'view', pathMatch: 'full' }
    ]
  },
  {
    path: 'team',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'view', pathMatch: 'full' },
      { path: 'view', loadChildren: () => import('./pages/team/view/view.module').then(m => m.ViewModule) },
      { path: 'add', loadChildren: () => import('./pages/team/add/add.module').then(m => m.AddModule) },
      { path: ':key', loadChildren: () => import('./pages/team/edit/edit.module').then(m => m.EditModule) },
      { path: '**', redirectTo: 'view', pathMatch: 'full' }
    ]
  },
  {
    path: 'event',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'view', pathMatch: 'full' },
      { path: 'view', loadChildren: () => import('./pages/generate/view/view.module').then(m => m.ViewModule) },
      { path: 'add', loadChildren: () => import('./pages/generate/add/add.module').then(m => m.AddModule) },
      // { path: ':key', loadChildren: () => import('./pages/generate/edit/edit.module').then(m => m.EditModule) },
      { path: '**', redirectTo: 'view', pathMatch: 'full' }
    ]
  },
  {
    path: 'page-not-found',
    component: LayoutComponent,
    loadChildren: () => import('./pages/page-not-found/page-not-found.module').then(m => m.PageNotFoundModule)
  },
  { path: '**', redirectTo: 'page-not-found', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }