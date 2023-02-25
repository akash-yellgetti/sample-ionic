import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController, Platform } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SERVER_URL } from '../../config/config';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import { Events } from '../services/events';

@Component({
  selector: 'app-login-otp',
  templateUrl: './login-otp.page.html',
  styleUrls: ['./login-otp.page.scss'],
})
export class LoginOtpPage {
  resultObj: any;
  model: any = new Array();
  public FrmLoginOtp: FormGroup;
  submitted = false;
  constructor(public navCtrl: NavController, private form: FormBuilder, private http: HttpClient, 
    private loadingCtrl: LoadingController, private toastCtrl: ToastController, private events: Events, private activateRoute: ActivatedRoute) {
    this.model.user_id = this.activateRoute.snapshot.paramMap.get('userID');
    this.model.otp = '';
    this.FrmLoginOtp = this.form.group({
      TxtOTP: [this.model.otp, Validators.compose([Validators.required])]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginOtpPage');
  }

  onSubmit(value) {
    if (this.FrmLoginOtp.valid) {
      let loading = this.loadingCtrl.create({
        message: 'Please wait...',
      });
      loading.then((loadingData) => {
        loadingData.present();
      });
      const body = {
        client_key: SERVER_URL.client_key,
        user_id: this.model.user_id,
        login_otp: this.model.otp
      };
      this.http.post(
        SERVER_URL.baseURL + '/services/authLoginOtp',
        body, {
        headers: new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded')
      }).subscribe(
          (data => {
            loading.then((loadingData) => { loadingData.dismiss(); });
            this.resultObj = data;
            if (this.resultObj.code == 200) {
              localStorage.setItem("il_user_id", this.resultObj.user_id);
              localStorage.setItem("il_user_name", this.resultObj.user_name);
              localStorage.setItem("il_country_phone_code", this.resultObj.country_phone_code);
              localStorage.setItem("il_country_id", this.resultObj.country_id);
              localStorage.setItem("il_mobile", this.resultObj.mobile);
              localStorage.setItem("il_email", this.resultObj.email);
              localStorage.setItem("il_profile_complete_flag", this.resultObj.profile_complete_flag);
              localStorage.setItem("il_profile_pic", this.resultObj.profile_pic_path);
              this.events.publish('loc_device_update', this.resultObj.user_id);
              if (parseInt(localStorage.getItem("il_profile_complete_flag")) == 0) {
                this.navCtrl.navigateRoot('/regprofile');
              } else if (parseInt(localStorage.getItem("il_profile_complete_flag")) == 2) {
                this.navCtrl.navigateRoot('/profile-gallery');
              } else {
                //1-complete
                this.navCtrl.navigateRoot('/home');
              }
            } else {
              this.toastCtrl.create({
                message: this.resultObj.message, position: 'top', duration: 2700
              }).then((toastData) => { toastData.present(); });
            }
          }),
          ((err: HttpErrorResponse) => {
            loading.then((loadingData) => { loadingData.dismiss(); });
            this.toastCtrl.create({
              message: 'Please check your network connectivity and try logging in again..', position: 'top', duration: 2700
            }).then((toastData) => { toastData.present(); });
          })
        );
    }
  }
}

