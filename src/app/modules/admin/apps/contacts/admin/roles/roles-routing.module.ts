import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RolesResolver } from './role.resolvers';

import { RolePage } from './roles.page';

const routes: Routes = [
  {
    path: '',
    component: RolePage,
    resolve  : {
      roles  : RolesResolver,
  }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RolesPageRoutingModule {}
