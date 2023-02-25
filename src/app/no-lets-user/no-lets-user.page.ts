import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-no-lets-user',
  templateUrl: './no-lets-user.page.html',
  styleUrls: ['./no-lets-user.page.scss'],
})
export class NoLetsUserPage {
  message="";
  constructor(public navCtrl: NavController, private activateRoute: ActivatedRoute) {
    this.message = this.activateRoute.snapshot.paramMap.get('message');
  }

  goToHome(){
    this.navCtrl.navigateRoot('/home');
  }

}

