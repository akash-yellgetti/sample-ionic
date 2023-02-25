import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, LoadingController, ToastController, Platform, AlertController } from '@ionic/angular';
import { SERVER_URL } from '../../config/config';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { InAppPurchase2, IAPProduct } from '@ionic-native/in-app-purchase-2/ngx';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.page.html',
  styleUrls: ['./plans.page.scss'],
})
export class PlansPage {
  resultObj: any;
  plans: IAPProduct[] = []; 
  tempLetsID: any;
  constructor(public navCtrl: NavController, public activateRoute: ActivatedRoute, private router: Router, private http: HttpClient,
    private plt: Platform, private toastCtrl: ToastController, private loadingCtrl: LoadingController, private store: InAppPurchase2, private ref: ChangeDetectorRef, private alertCtrl: AlertController) {
      this.tempLetsID = this.activateRoute.snapshot.paramMap.get('tempLetsID');
      this.plt.ready().then(() => {
        // this.store.verbosity = this.store.DEBUG;
        this.registerProducts();
        this.store.ready(()=>{ 
          this.plans=this.store.products;
          if(this.plans[this.plans.length-1]["price"]==='' || this.plans[this.plans.length-1]["price"]===null){
             this.plans.splice(-1);
          }
          this.ref.detectChanges();
        });
    });
  }

  ionViewDidLoad() {
    
  }

  registerProducts(){
    if(this.store.products.length>0){
      return;
    }
    let loading = this.loadingCtrl.create({
      message: 'Please wait...',
    });
    loading.then((loadingData) => {
      loadingData.present();
    });
    this.http.post(
    SERVER_URL.baseURL + '/services/getSubscriptionPlans',
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
            for(let i=0; i<this.resultObj.plans.length; i++) {
              this.store.register({
                id: this.resultObj.plans[i].apple_product_key,
                type: this.store.CONSUMABLE
              });
            }
            this.store.refresh();
            this.setupListeners();
        }
    },
        ((err: HttpErrorResponse) => { loading.then((loadingData) => { loadingData.dismiss(); }); })
    );
  }

  setupListeners(){
    this.store.when('product')
    .approved((p: IAPProduct)=>{
      //Purchase Successfully Added to the My Subscription List
      this.http.post(
        SERVER_URL.baseURL + '/services/saveIOSSubscription',
        {
            client_key: SERVER_URL.client_key,
            user_id: localStorage.getItem("il_user_id"),
            p_id: p.id,
            transaction_id: p.transaction.id,
            transaction_device: 2
        }, {
        headers: new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded')
        }).subscribe(data => {
            this.resultObj = data;
            if (this.resultObj.code == 200) {
              this.toastCtrl.create({ message: "Subscribed successfully.", duration: 3000, position: 'top', cssClass: "custom-success-class" })
              .then((toastData) => { toastData.present(); });
  
              if(this.tempLetsID>0){
                this.navCtrl.navigateForward('/home/'+this.tempLetsID);
              }else{
                this.navCtrl.navigateForward('/my-subscription');
              }
            }else{
              this.toastCtrl.create({ message: "Something went wrong. Please try again..", duration: 3000, position: 'top', cssClass: "custom-failure-class" })
              .then((toastData) => { toastData.present(); });
            }
        },
            ((err: HttpErrorResponse) => {
              this.toastCtrl.create({ message: "Something went wrong. Please try again..", duration: 3000, position: 'top', cssClass: "custom-failure-class" })
              .then((toastData) => { toastData.present(); });
            })
        );
        //this.ref.detectChanges();
        return p.verify();
    }).verified((p: IAPProduct)=>p.finish());
  }

  purchase(product: IAPProduct){
    this.store.order(product).then(p =>{
      this.ref.detectChanges();
    },e =>{
      this.presentAlert("Failed", 'Purchase failed, try again later: ${e}');
    });
  }

  restore(){
    this.store.refresh();
  }

  async presentAlert(header, message){
    const alert = await this.alertCtrl.create({
      header: header,
      subHeader: '',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  backToSubscription(){
    this.navCtrl.navigateBack('/my-subscription');
  } 
}
