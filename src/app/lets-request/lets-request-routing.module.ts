import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LetsRequestPage } from './lets-request.page';

const routes: Routes = [
  {
    path: '',
    component: LetsRequestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LetsRequestPageRoutingModule {}
