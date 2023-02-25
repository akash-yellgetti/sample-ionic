import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController, Platform } from '@ionic/angular';
import { SERVER_URL } from '../../config/config';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { InAppPurchase2, IAPProduct } from '@ionic-native/in-app-purchase-2/ngx';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.page.html',
  styleUrls: ['./subscriptions.page.scss'],
})
export class SubscriptionsPage {
  resultObj: any;
  plans:any = new Array();
  tempSubscriptionID = 0;
  PGKey = '';
  razorpayPaymentID = "";
  razorpayOrderID = "";
  paymentAmt = 0;
  tempLetsID:any;
  pgOrderID: any;
  constructor(public navCtrl: NavController, public activateRoute: ActivatedRoute, private router: Router, private http: HttpClient,
    private toastCtrl: ToastController, private loadingCtrl: LoadingController) {
    this.tempLetsID=this.activateRoute.snapshot.paramMap.get('tempLetsID');
  }

  ionViewDidLoad() {

  }

  openPackages(){
    this.navCtrl.navigateForward('/packages');
  }

  buySubscription(){
    
  }

  // getSubscriptionPlans() {
  //   let loading = this.loadingCtrl.create({
  //     message: 'Please wait...',
  //   });
  //   loading.then((loadingData) => {
  //     loadingData.present();
  //   });
  //   this.http.post(
  //   SERVER_URL.baseURL + '/services/getSubscriptionPlans',
  //   {
  //       client_key: SERVER_URL.client_key,
  //       user_id: localStorage.getItem("il_user_id"),
  //       plan_type: 1
  //   }, {
  //   headers: new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded')
  //   }).subscribe(data => {
  //     loading.then((loadingData) => { loadingData.dismiss(); });
  //       this.resultObj = data;
  //       if (this.resultObj.code == 200) {
  //           this.plans = this.resultObj.plans;
  //       }
  //   },
  //       ((err: HttpErrorResponse) => { loading.then((loadingData) => { loadingData.dismiss(); }); })
  //   );
  // }



  goToProfile(){
    this.navCtrl.navigateForward('/profile');
  }



}
