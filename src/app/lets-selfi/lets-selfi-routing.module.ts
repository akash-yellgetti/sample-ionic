import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LetsSelfiPage } from './lets-selfi.page';

const routes: Routes = [
  {
    path: '',
    component: LetsSelfiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LetsSelfiPageRoutingModule {}
