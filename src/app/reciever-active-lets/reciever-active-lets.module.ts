import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecieverActiveLetsPageRoutingModule } from './reciever-active-lets-routing.module';

import { RecieverActiveLetsPage } from './reciever-active-lets.page';
// import { Swiper } from 'swiper/swiper';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecieverActiveLetsPageRoutingModule,
    // Swiper
  ],
  declarations: [RecieverActiveLetsPage]
})
export class RecieverActiveLetsPageModule {}
