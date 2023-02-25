import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PetRegDetailsPage } from './pet-reg-details.page';

const routes: Routes = [
  {
    path: '',
    component: PetRegDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PetRegDetailsPageRoutingModule {}
