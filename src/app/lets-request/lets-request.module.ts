import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LetsRequestPageRoutingModule } from './lets-request-routing.module';

import { LetsRequestPage } from './lets-request.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LetsRequestPageRoutingModule
  ],
  declarations: [LetsRequestPage]
})
export class LetsRequestPageModule {}
