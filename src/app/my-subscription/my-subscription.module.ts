import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MySubscriptionPageRoutingModule } from './my-subscription-routing.module';

import { MySubscriptionPage } from './my-subscription.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MySubscriptionPageRoutingModule
  ],
  declarations: [MySubscriptionPage]
})
export class MySubscriptionPageModule {}
