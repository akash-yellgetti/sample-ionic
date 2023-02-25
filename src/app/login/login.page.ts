import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController, Platform } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SERVER_URL } from '../../config/config';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Device } from '@capacitor/device';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { Events } from '../services/events';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  public FrmLogin: FormGroup;
  model: any = Array();
  countries: any;
  resultObj: any;
  mobRegFlag: boolean = false;
  geoLocationFound: boolean = false;
  isIOSDevice: boolean = false;
  deviceID: string = "";
  currentLat: number = 0;
  currentLang: number = 0;
  deviceType: number = 1;
  submitted = false;
  password:any;
  constructor(public navCtrl: NavController, public plt: Platform, 
      private geolocation: Geolocation, private toastCtrl: ToastController, 
      private form: FormBuilder, private http: HttpClient, private loadingCtrl: LoadingController, private events: Events) {
      this.model.country_id = "99";
      this.model.country_phone_code = "+91";
      this.model.min_mobile = 10;
      this.model.max_mobile = 10;
      this.model.mobile = '';
      this.model.password = '';
      this.countries = [
          {
              "country_id": 99,
              "country_name": "India",
              "country_phone_code": 91,
              "min_mobile": 10,
              "max_mobile": 10,
          }
      ];
      this.FrmLogin = this.form.group({
          DdlCountry: [this.model.country_phone_code],
          TxtLogMobile: [this.model.mobile, Validators.compose([Validators.required, Validators.pattern('[0-9]{' + this.model.min_mobile + ',' + this.model.max_mobile + '}'), Validators.minLength(this.model.min_mobile), Validators.maxLength(this.model.max_mobile)])],
          TxtLoginPassword:[this.model.password, Validators.compose([Validators.required])]
      });

      this.isIOSDevice = this.plt.is('ios');
      if (this.isIOSDevice) {
          this.deviceType = 2;
      }
      this.geolocation.getCurrentPosition().then(resp => {
          this.geoLocationFound = true;
          this.currentLat = resp.coords.latitude
          this.currentLang = resp.coords.longitude
      }).catch(error => {
          console.log('Error getting location', error);
      });

      this.getDeviceID();
  }

  getDeviceID = async () => {
    const info = await Device.getId();
    this.deviceID = info.uuid;
  };

  ngAfterViewInit() {
      this.getCountries();
  }

  ionViewDidLoad() {
      console.log('ionViewDidLoad LoginPage');
  }

  goToRegisteration() {
     //MOve to registration
     this.navCtrl.navigateForward('/registration');
  }

  goToForgotPassword(){
    this.navCtrl.navigateForward('/forgot-password');
  }

  getCountries() {
      this.http.post(
          SERVER_URL.baseURL + '/services/getCountries',
          { client_key: SERVER_URL.client_key }, {
          headers: new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded')
      })
          .subscribe(data => {
              this.resultObj = data;
              if (this.resultObj.code == 200) {
                  this.countries = this.resultObj.result;
              }
          },
              ((err: HttpErrorResponse) => { })
          );
  }

  getCountryVal() {
      for (var key in this.countries) {
          if (("+" + this.countries[key].country_phone_code) == this.model.country_phone_code) {
              this.model.country_id = this.countries[key].country_id;
              this.model.min_mobile = this.countries[key].min_mobile;
              this.model.max_mobile = this.countries[key].max_mobile;
              this.FrmLogin = this.form.group({
                  DdlCountry: [this.model.country_phone_code],
                  TxtLogMobile: [this.model.mobile, Validators.compose([Validators.required, Validators.pattern('[0-9]{' + this.model.min_mobile + ',' + this.model.max_mobile + '}'), Validators.minLength(this.model.min_mobile), Validators.maxLength(this.model.max_mobile)])]
              });
          }
      }
  }

  onSubmit(value) {
      if (this.FrmLogin.valid) {

        const loading = this.loadingCtrl.create({
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
          password: this.model.password,
          country_phone_code: countryCode,
          country_id: this.model.country_id
        };
        
        this.http.post(
            SERVER_URL.baseURL + '/services/authUser',
            body, {
            headers: new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded')
        })
          .subscribe(
            (data => {
              this.resultObj = data;
              loading.then((loadingData) => { loadingData.dismiss(); });
              if (this.resultObj.code == 200) {
                  localStorage.setItem("il_user_id", this.resultObj.user_id);
                  localStorage.setItem("il_user_name", this.resultObj.user_name);
                  localStorage.setItem("il_country_phone_code", this.resultObj.country_phone_code);
                  localStorage.setItem("il_country_id", this.resultObj.country_id);
                  localStorage.setItem("il_mobile", this.resultObj.mobile);
                  localStorage.setItem("il_email", this.resultObj.email);
                  localStorage.setItem("il_profile_complete_flag", this.resultObj.profile_complete_flag);
                  localStorage.setItem("il_profile_pic", this.resultObj.profile_pic_path);
                  this.events.publish('loc_device_update', {userID:this.resultObj.user_id});
                  if (parseInt(this.resultObj.profile_complete_flag) == 0) {
                    this.navCtrl.navigateForward('/regprofile');
                  } else if (parseInt(this.resultObj.profile_complete_flag) == 2) {
                    this.navCtrl.navigateForward('/profile-gallery');
                  } else {
                    this.navCtrl.navigateForward('/home');
                  }
              } else if (this.resultObj.code == 502) {
                  this.mobRegFlag = true;
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
}
