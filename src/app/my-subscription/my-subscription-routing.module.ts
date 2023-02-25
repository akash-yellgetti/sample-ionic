import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MySubscriptionPage } from './my-subscription.page';

const routes: Routes = [
  {
    path: '',
    component: MySubscriptionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MySubscriptionPageRoutingModule {}
