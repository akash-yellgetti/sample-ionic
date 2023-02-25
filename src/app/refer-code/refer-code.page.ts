import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController } from '@ionic/angular';
import { SERVER_URL } from '../../config/config';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Clipboard } from '@awesome-cordova-plugins/clipboard/ngx';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';

@Component({
  selector: 'app-refer-code',
  templateUrl: './refer-code.page.html',
  styleUrls: ['./refer-code.page.scss'],
})
export class ReferCodePage {
  resultObj: any;
  referralCode: any;
  constructor(public navCtrl: NavController, private loadingCtrl: LoadingController,
    private http: HttpClient, private toastCtrl: ToastController,private Clipboard: Clipboard, 
    private socialSharing: SocialSharing) {
      this.getReferrralCode();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReferCodePage');
  }

  getReferrralCode() {
    const loading = this.loadingCtrl.create({
      message: 'Please wait...',
    });
    loading.then((loadingData) => {
      loadingData.present();
    });
		const body = {
			client_key: SERVER_URL.client_key,
			user_id: localStorage.getItem("il_user_id")
		};
		this.http.post(
			SERVER_URL.baseURL + '/services/getReferrralCode',
			body, {
			headers: new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded')
		}).subscribe(
				(data => {
          loading.then((loadingData) => { loadingData.dismiss(); });
					this.resultObj = data;
					if (this.resultObj.code == 200) {
            this.referralCode=this.resultObj.referral_code;
					} else {
            this.toastCtrl.create({
              message: this.resultObj.message, position: 'top', duration: 2700
            }).then((toastData) => { toastData.present(); });

					
					}
				}),
				((err: HttpErrorResponse) => {
          loading.then((loadingData) => { loadingData.dismiss(); });
          this.toastCtrl.create({
            message: 'Please check your network connectivity and try logging in again.', position: 'top', duration: 2700
          }).then((toastData) => { toastData.present(); });
				})
			);
	}

  showInviteFriendsPage() {
    this.socialSharing.share("Register on itslets using my referral code "+ this.referralCode +". i will get free lets.").then(()=>{
      console.log("Sharing...");
    }).catch((err)=>{
      console.log(err);
    });
  }

  copyReferalCode(){
    this.Clipboard.copy(this.referralCode).then(()=>{
      this.toastCtrl.create({
        message: 'Copied successfully.', position: 'top', duration: 2700, cssClass: "custom-success-class"
      }).then((toastData) => { toastData.present(); });
    });
  }
}
