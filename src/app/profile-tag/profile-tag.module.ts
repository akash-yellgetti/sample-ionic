import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileTagPageRoutingModule } from './profile-tag-routing.module';

import { ProfileTagPage } from './profile-tag.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileTagPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ProfileTagPage]
})
export class ProfileTagPageModule {}
