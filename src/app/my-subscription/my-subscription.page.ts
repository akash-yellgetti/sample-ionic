import { Component } from '@angular/core';
import { NavController, LoadingController, IonBackButtonDelegate } from '@ionic/angular';
import { SERVER_URL } from '../../config/config';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-my-subscription',
  templateUrl: './my-subscription.page.html',
  styleUrls: ['./my-subscription.page.scss'],
})
export class MySubscriptionPage {
  resultObj: any;
  plans:any = new Array();
  subscribedFlag=false;
  
  constructor(public navCtrl: NavController, private http: HttpClient, private loadingCtrl: LoadingController) {
    
  }

  ionViewDidEnter() {
    this.getUserSubscription();
  }

  getUserSubscription() {
    let loading = this.loadingCtrl.create({
      message: 'Please wait...',
    });
    loading.then((loadingData) => {
      loadingData.present();
    });
    this.http.post(
    SERVER_URL.baseURL + '/services/getUserSubscription',
    {
        client_key: SERVER_URL.client_key,
        user_id: localStorage.getItem("il_user_id"),
        plan_type: 1
    }, {
    headers: new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded')
    }).subscribe(data => {
      loading.then((loadingData) => { loadingData.dismiss(); });
        this.resultObj = data;
        if (this.resultObj.code == 200) {
          this.subscribedFlag = true;
        }
        else{
          this.subscribedFlag = false;
        }
    },
        ((err: HttpErrorResponse) => { loading.then((loadingData) => { loadingData.dismiss(); }); })
    );
  }

  backToProfile(){
    this.navCtrl.navigateBack('/profile');
  } 

  openPlans(){
    this.navCtrl.navigateRoot('/plans');
  }
}
