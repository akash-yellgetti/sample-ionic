import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController, Platform } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SERVER_URL } from '../../config/config';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import { Events } from '../services/events';

@Component({
  selector: 'app-regotp',
  templateUrl: './regotp.page.html',
  styleUrls: ['./regotp.page.scss'],
})
export class RegotpPage {
  resultObj: any;
  model: any = new Array();
  public FrmRegOtp: FormGroup;
  submitted=false;
  constructor(public navCtrl: NavController, private events: Events, private form: FormBuilder, private http: HttpClient, 
    private loadingCtrl: LoadingController, private toastCtrl: ToastController, private activateRoute: ActivatedRoute) {
      this.model.temp_user_id = this.activateRoute.snapshot.paramMap.get('tempUserID');
      this.model.otp = '';
      this.FrmRegOtp = this.form.group({
          TxtOTP: [this.model.otp, Validators.compose([Validators.required])]
      });
  }

  onSubmit(value) {
      if (this.FrmRegOtp.valid) {
        let loading = this.loadingCtrl.create({
          message: 'Please wait...',
        });
        loading.then((loadingData) => {
            loadingData.present();
          });
          const body = {
              client_key: SERVER_URL.client_key,
              temp_user_id: this.model.temp_user_id,
              reg_otp: this.model.otp
          };
          this.http.post(
              SERVER_URL.baseURL + '/services/authRegOtp',
              body, {
              headers: new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded')
          }).subscribe(
                  (data => {
                    loading.then((loadingData) => { loadingData.dismiss(); });
                      this.resultObj = data;
                      if (this.resultObj.code == 200) {
                          localStorage.setItem("il_user_id", this.resultObj.user_id);
                          localStorage.setItem("il_user_name", "");
                          localStorage.setItem("il_country_phone_code", this.resultObj.country_phone_code);
                          localStorage.setItem("il_country_id", this.resultObj.country_id);
                          localStorage.setItem("il_mobile", this.resultObj.mobile);
                          localStorage.setItem("il_email", this.resultObj.email);
                          localStorage.setItem("il_profile_complete_flag", this.resultObj.profile_complete_flag);
                          this.events.publish('loc_device_update', this.resultObj.user_id);
                          this.navCtrl.navigateRoot('/pet-reg-details');
                      } else {
                        this.toastCtrl.create({
                          message: this.resultObj.message, position: 'top', duration: 2700
                        }).then((toastData) => { toastData.present(); });
                      }
                  }),
                  ((err: HttpErrorResponse) => {
                      let loading = this.loadingCtrl.create({
                        message: 'Please wait...',
                      });
                      loading.then((loadingData) => {
                        loadingData.present();
                      });
                      this.toastCtrl.create({
                        message: 'Please check your network connectivity and try logging in again..', position: 'top', duration: 2700
                      }).then((toastData) => { toastData.present(); });
                  })
              );
      }
  }
}
