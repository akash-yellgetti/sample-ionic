import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LetsSelfiPageRoutingModule } from './lets-selfi-routing.module';

import { LetsSelfiPage } from './lets-selfi.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LetsSelfiPageRoutingModule
  ],
  declarations: [LetsSelfiPage]
})
export class LetsSelfiPageModule {}
