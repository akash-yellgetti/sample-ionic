import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AcceptedWaitingPageRoutingModule } from './accepted-waiting-routing.module';

import { AcceptedWaitingPage } from './accepted-waiting.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AcceptedWaitingPageRoutingModule
  ],
  declarations: [AcceptedWaitingPage]
})
export class AcceptedWaitingPageModule {}
