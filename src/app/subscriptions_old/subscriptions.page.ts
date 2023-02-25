import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController, Platform } from '@ionic/angular';
import { SERVER_URL } from '../../config/config';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import  'capacitor-razorpay';
import { Plugins } from '@capacitor/core';
const { Checkout } = Plugins;
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
    private toastCtrl: ToastController, private platform: Platform, private loadingCtrl: LoadingController) {
    this.tempLetsID=this.activateRoute.snapshot.paramMap.get('tempLetsID');
    this.getSubscriptionPlans();
    this.getPGKeys();
  }

  ionViewDidLoad() {

  }

  openPackages(){
    this.navCtrl.navigateForward('/packages');
  }

  getSubscriptionPlans() {
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
            this.plans = this.resultObj.plans;
        }
    },
        ((err: HttpErrorResponse) => { loading.then((loadingData) => { loadingData.dismiss(); }); })
    );
  }

  buySubscription(plan){
    let loading = this.loadingCtrl.create({
      message: 'Please wait...',
    });
    loading.then((loadingData) => {
      loadingData.present();
    });
    this.paymentAmt = parseFloat(plan.discount_price);
    this.http.post(
      SERVER_URL.baseURL + '/services/saveTempSubscription',
      {
          client_key: SERVER_URL.client_key,
          user_id: localStorage.getItem("il_user_id"),
          subscription_plan_id: plan.subscription_plan_id,
          payable_amt:plan.discount_price
      }, {
      headers: new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded')
      }).subscribe(data => {
          loading.then((loadingData) => { loadingData.dismiss(); });
          this.resultObj = data;
          if (this.resultObj.code == 200) {
            this.tempSubscriptionID=this.resultObj.temp_subscription_id;
            this.pgOrderID=this.resultObj.pg_order_id;
            this.makePayment();
          }else{
            this.toastCtrl.create({ message: "Something went wrong. Please try again..", duration: 3000, position: 'top', cssClass: "custom-failure-class" })
            .then((toastData) => { toastData.present(); });
          }
      },
          ((err: HttpErrorResponse) => {
            loading.then((loadingData) => { loadingData.dismiss(); });
            this.toastCtrl.create({ message: "Something went wrong. Please try again..", duration: 3000, position: 'top', cssClass: "custom-failure-class" })
            .then((toastData) => { toastData.present(); });
          })
      );
  }

  getPGKeys() {
    this.http.post(
      SERVER_URL.baseURL + '/services/getPGKeys',
      {
        client_key: SERVER_URL.client_key
      }, {
      headers: new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded')
    })
      .subscribe(
        (data => {
          this.resultObj = data;
          if (this.resultObj.code == 200) {
            this.PGKey = this.resultObj.api_key;
          } else {
            this.PGKey = '';
          }
        }),
        ((err: HttpErrorResponse) => {
          this.PGKey = '';
        }));
  }


  async makePayment() {
    // this.platform.ready().then(() => {
    //   const options = {
    //     description: 'Online Payment',
    //     image: '',
    //     currency: 'INR',
    //     key: this.PGKey,
    //     amount: this.paymentAmt * 100,
    //     name: 'Itslets',
    //     prefill: {
    //       email: localStorage.getItem('il_email'),
    //       contact: localStorage.getItem('il_email'),
    //       name: localStorage.getItem('il_user_name')
    //     },
    //     theme: {
    //       color: '#064CB5'
    //     }
    //   }
    //   const successCallback = (success) => {
    //     this.razorpayPaymentID = success.razorpay_payment_id;
    //     this.razorpayOrderID = success.razorpay_order_id;
    //     this.saveSubscription();
    //   };

    //   const cancelCallback = (error) => {
    //     this.toastCtrl.create({
    //       message: 'Something went wrong. Please try again..', position: 'top', duration: 2700, cssClass: "custom-failure-class"
    //     }).then((toastData) => { toastData.present(); });
    //   };
    //   RazorpayCheckout.on('payment.success', successCallback);
    //   RazorpayCheckout.on('payment.cancel', cancelCallback);
    //   RazorpayCheckout.open(options);
    // });

    const options = {
      key: this.PGKey,
      amount: this.paymentAmt * 100,
      description: 'Online Payment',
      image: '',
      order_id: this.pgOrderID,
      currency: 'INR',
      name: 'Itslets',
      prefill: {
        email: localStorage.getItem('il_email'),
        contact: localStorage.getItem('il_email'),
        name: localStorage.getItem('il_user_name')
      },
      theme: {
        color: '#064CB5'
      }
    }


    try {
      let data = (await Checkout.open(options));
      const loading = this.loadingCtrl.create({
        message: 'Please wait..'
      });
      loading.then((loadingData) => {
        loadingData.present();
      });
      const body = {
        client_key: SERVER_URL.client_key,
        user_id: localStorage.getItem("il_user_id"),
        temp_subscription_id: this.tempSubscriptionID,
        payID: data.response['razorpay_payment_id'],
        orderID: data.response['razorpay_order_id'],
        signature: data.response['razorpay_signature']
      };
      this.http.post(
          SERVER_URL.baseURL + '/services/saveSubscription',
          body, {
          headers: new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded')
      }).subscribe(
        (data => {
          loading.then((loadingData) => { loadingData.dismiss(); });
          this.resultObj = data;
          if (this.resultObj.code === 200) {
            this.router.navigate(['my-subscription']);
          }
          else {
            this.toastCtrl.create({
              message: this.resultObj.message, position: 'top', duration: 2700, cssClass: "custom-failure-class"
            }).then((toastData) => { toastData.present(); });
          }
        }),
        ((err: HttpErrorResponse) => {
          loading.then((loadingData) => { loadingData.dismiss(); });
        })
      );
      // console.log('message'+ data.response['razorpay_payment_id']);
      // console.log('message'+ data.response['razorpay_order_id']);
      // console.log('message'+ data.response['razorpay_signature']);
    } catch (error) {
      this.toastCtrl.create({
        message: error.message, position: 'top', duration: 2700, cssClass: "custom-failure-class"
      }).then((toastData) => { toastData.present(); });
    }
  }

  goToProfile(){
    this.navCtrl.navigateForward('/profile');
  }

  // makePayment() {
  //   this.platform.ready().then(() => {
  //     const options = {
  //       description: 'Online Payment',
  //       image: '',
  //       currency: 'INR',
  //       key: this.PGKey,
  //       amount: this.paymentAmt * 100,
  //       name: 'Itslets',
  //       prefill: {
  //         email: localStorage.getItem('il_email'),
  //         contact: localStorage.getItem('il_email'),
  //         name: localStorage.getItem('il_user_name')
  //       },
  //       theme: {
  //         color: '#064CB5'
  //       }
  //     }
  //     const successCallback = (success) => {
  //       this.razorpayPaymentID = success.razorpay_payment_id;
  //       this.razorpayOrderID = success.razorpay_order_id;
  //       this.saveSubscription();
  //     };

  //     const cancelCallback = (error) => {
  //       let toast = this.toastCtrl.create({ message: "Something went wrong. Please try again..", duration: 3000, position: 'top', cssClass: "custom-failure-class" });
  //                   toast.present();
  //     };
  //     RazorpayCheckout.on('payment.success', successCallback);
  //     RazorpayCheckout.on('payment.cancel', cancelCallback);
  //     RazorpayCheckout.open(options);
  //   });
  // }

  // saveSubscription(){
  //   this.http.post(
  //     SERVER_URL.baseURL + '/services/saveSubscription',
  //     {
  //         client_key: SERVER_URL.client_key,
  //         user_id: localStorage.getItem("il_user_id"),
  //         temp_subscription_id: this.tempSubscriptionID
  //     }, {
  //     headers: new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded')
  //     }).subscribe(data => {
  //         this.resultObj = data;
  //         if (this.resultObj.code == 200) {
  //           this.toastCtrl.create({ message: "Subscribed successfully.", duration: 3000, position: 'top', cssClass: "custom-success-class" })
  //           .then((toastData) => { toastData.present(); });

  //           if(this.tempLetsID>0){
  //             this.navCtrl.navigateForward('/home/'+this.tempLetsID);
  //           }else{
  //             this.navCtrl.navigateForward('/my-subscription');
  //           }
  //         }else{
  //           this.toastCtrl.create({ message: "Something went wrong. Please try again..", duration: 3000, position: 'top', cssClass: "custom-failure-class" })
  //           .then((toastData) => { toastData.present(); });
  //         }
  //     },
  //         ((err: HttpErrorResponse) => {
  //           this.toastCtrl.create({ message: "Something went wrong. Please try again..", duration: 3000, position: 'top', cssClass: "custom-failure-class" })
  //           .then((toastData) => { toastData.present(); });
  //         })
  //     );
  // }


}
