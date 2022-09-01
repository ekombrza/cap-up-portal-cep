import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EgliseUpdatePage } from './eglise-update.page';

const routes: Routes = [
  {
    path: '',
    component: EgliseUpdatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EgliseUpdatePageRoutingModule {}
