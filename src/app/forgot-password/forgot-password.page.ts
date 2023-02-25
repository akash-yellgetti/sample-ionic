import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController, Platform } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SERVER_URL } from '../../config/config';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Events } from '../services/events';
import { Router } from '@angular/router';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage{
  resultObj: any;
  countries: any;
  model: any = new Array();
  public FrmForgotOTP: FormGroup;
  mobRegFlag: boolean = false;
  submitted: boolean = false;
  constructor(public navCtrl: NavController, public plt: Platform, private toastCtrl: ToastController, 
    private form: FormBuilder, private http: HttpClient, private loadingCtrl: LoadingController, private events: Events, private router: Router){ 
      this.model.country_id = "99";
      this.model.country_phone_code = "+91";
      this.model.min_mobile = 10;
      this.model.max_mobile = 10;
      this.model.mobile = '';
      this.countries = [
          {
              "country_id": 99,
              "country_name": "India",
              "country_phone_code": 91,
              "min_mobile": 10,
              "max_mobile": 10,
          }
      ];
      this.FrmForgotOTP = this.form.group({
          DdlCountry: [this.model.country_phone_code],
          TxtLogMobile: [this.model.mobile, Validators.compose([Validators.required, Validators.pattern('[0-9]{' + this.model.min_mobile + ',' + this.model.max_mobile + '}'), Validators.minLength(this.model.min_mobile), Validators.maxLength(this.model.max_mobile)])]
      });
    }

    ngAfterViewInit() {
      this.getCountries();
  }

  ionViewDidLoad() {
      console.log('ionViewDidLoad RegistrationPage');
  }

  getCountryVal() {
      for (var key in this.countries) {
          if (("+" + this.countries[key].country_phone_code) == this.model.country_phone_code) {
              this.model.country_id = this.countries[key].country_id;
              this.model.min_mobile = this.countries[key].min_mobile;
              this.model.max_mobile = this.countries[key].max_mobile;
              this.FrmForgotOTP = this.form.group({
                  DdlCountry: [this.model.country_phone_code],
                  TxtLogMobile: [this.model.mobile, Validators.compose([Validators.required, Validators.pattern('[0-9]{' + this.model.min_mobile + ',' + this.model.max_mobile + '}'), Validators.minLength(this.model.min_mobile), Validators.maxLength(this.model.max_mobile)])]
              });
          }
      }
  }

  getCountries() {
      this.http.post(
          SERVER_URL.baseURL + '/services/getCountries',
          { client_key: SERVER_URL.client_key }, {
          headers: new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded')
      }).subscribe(data => {
          this.resultObj = data;
          if (this.resultObj.code == 200) {
              this.countries = this.resultObj.result;
          }
      },
          ((err: HttpErrorResponse) => { })
      );
  }

  onSubmit(value) {
      if (this.FrmForgotOTP.valid) {
          let loading = this.loadingCtrl.create({
              message: 'Please wait...',
          });
          loading.then((loadingData) => {
            loadingData.present();
          });
          let countryCode = this.model.country_phone_code.substring(1, this.model.country_phone_code.length);
          this.mobRegFlag = false;
          const body = {
              client_key: SERVER_URL.client_key,
              mobile: this.model.mobile,
              country_phone_code: countryCode,
              country_id: this.model.country_id
          };
          this.http.post(
              SERVER_URL.baseURL + '/services/checkForgotPassword',
              body, {
              headers: new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded')
          }).subscribe(
                  (data => {
                    loading.then((loadingData) => { loadingData.dismiss(); });
                    this.resultObj = data;
                      if (this.resultObj.code == 200) {
                          this.router.navigate(['/reset-password',this.resultObj.user_id]);
                      } else if (this.resultObj.code == 500) {
                          this.mobRegFlag = true;
                          this.toastCtrl.create({
                            message: this.resultObj.message, position: 'top', duration: 2700
                          }).then((toastData) => { toastData.present(); });
                      }else{
                        this.toastCtrl.create({
                          message: this.resultObj.message, position: 'top', duration: 2700
                        }).then((toastData) => { toastData.present(); });
                      }
                  }),
                  ((err: HttpErrorResponse) => {
                      loading.then((loadingData) => { loadingData.dismiss(); });
                      this.toastCtrl.create({
                        message: this.resultObj.message, position: 'top', duration: 2700
                      }).then((toastData) => { toastData.present(); });
                  })
              );
      }
  }

  goToLogin() {
    this.navCtrl.navigateForward('/login');
  }

}
