import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PetRegDetailsPageRoutingModule } from './pet-reg-details-routing.module';

import { PetRegDetailsPage } from './pet-reg-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PetRegDetailsPageRoutingModule
  ],
  declarations: [PetRegDetailsPage]
})
export class PetRegDetailsPageModule {}
