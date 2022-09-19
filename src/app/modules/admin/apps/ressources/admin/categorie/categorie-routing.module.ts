import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoriePage } from './categorie.page';
import { CategoriesResolver } from './categorie.resolvers';

const routes: Routes = [
  {
    path: '',
    component: CategoriePage,
    resolve  : {
      categories  : CategoriesResolver,
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoriePageRoutingModule {}
