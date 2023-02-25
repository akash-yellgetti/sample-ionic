import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcceptedWaitingPage } from './accepted-waiting.page';

const routes: Routes = [
  {
    path: '',
    component: AcceptedWaitingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcceptedWaitingPageRoutingModule {}
