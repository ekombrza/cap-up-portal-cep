import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardPage } from './dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: DashboardPage,
    children: [
      {
        path: 'dashboard',
        children: [
          {
            path: '',
            loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardPageModule)
          }
        ]
      },
      {
        path: 'bookmarks',
        children: [
          {
            path: '',
            loadChildren: () => import('./bookmarks/bookmarks.module').then( m => m.BookmarksPageModule)
          }
        ]
      },
      {
        path: 'shared-with-you',
        children: [
          {
            path: '',
            loadChildren: () => import('./shared-with-you/shared-with-you.module').then( m => m.SharedWithYouPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/apps/ressources/dashboard/dashboard',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardPageRoutingModule {}
