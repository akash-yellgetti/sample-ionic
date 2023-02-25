import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController, Platform } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SERVER_URL } from '../../config/config';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Events } from '../services/events';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage{
  resultObj: any;
  countries: any;
  model: any = new Array();
  public FrmRegistration: FormGroup;
  mobRegFlag: boolean = false;
  mismatch: boolean = false;
  submitted: boolean = false;
  privacyChecked: boolean = false;
  constructor(public navCtrl: NavController, public plt: Platform, private toastCtrl: ToastController, 
    private form: FormBuilder, private http: HttpClient, private loadingCtrl: LoadingController, private events: Events) { 
    this.model.country_id = "99";
    this.model.country_phone_code = "+91";
    this.model.min_mobile = 10;
    this.model.max_mobile = 10;
    this.model.mobile = '';
    this.model.password = '';
    this.model.confpassword = '';
    this.model.privacyFlag = '0';
    this.countries = [
        {
            "country_id": 99,
            "country_name": "India",
            "country_phone_code": 91,
            "min_mobile": 10,
            "max_mobile": 10,
        }
    ];
    this.FrmRegistration = this.form.group({
        DdlCountry: [this.model.country_phone_code],
        TxtLogMobile: [this.model.mobile, Validators.compose([Validators.required, Validators.pattern('[0-9]{' + this.model.min_mobile + ',' + this.model.max_mobile + '}'), Validators.minLength(this.model.min_mobile), Validators.maxLength(this.model.max_mobile)])],
        TxtPwdRegister: [this.model.password, Validators.compose([Validators.required])],
        TxtConfPwdRegister: [this.model.confpassword, Validators.compose([Validators.required])],
        ChkTerms: [this.model.privacyFlag, Validators.compose([Validators.required])]
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
            this.FrmRegistration = this.form.group({
                DdlCountry: [this.model.country_phone_code],
                TxtLogMobile: [this.model.mobile, Validators.compose([Validators.required, Validators.pattern('[0-9]{' + this.model.min_mobile + ',' + this.model.max_mobile + '}'), Validators.minLength(this.model.min_mobile), Validators.maxLength(this.model.max_mobile)])],
                TxtPwdRegister: [this.model.password, Validators.compose([Validators.required])],
                TxtConfPwdRegister: [this.model.confpassword, Validators.compose([Validators.required])],
                ChkTerms: [this.model.privacyFlag, Validators.compose([Validators.required])]
            });
        }
    }
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


checkTerms(e){
    this.privacyChecked = e.target.checked;
    console.log(this.privacyChecked);
}
onSubmit(value) {
    this.mismatch = false;
    if (this.FrmRegistration.valid) {
        if(!this.privacyChecked){
            this.toastCtrl.create({
                message: "Please agree to the Terms and Condition before submitting", position: 'top', duration: 3000
              }).then((toastData) => { toastData.present(); });
            return;
        }
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
            password: this.model.password,
            confpassword: this.model.confpassword,
            country_phone_code: countryCode,
            country_id: this.model.country_id
        }; 
        this.http.post(
            SERVER_URL.baseURL + '/services/saveTempUser',
            body, {
            headers: new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded')
        })
            .subscribe(
                (data => {
                    loading.then((loadingData) => { loadingData.dismiss(); });
                    this.resultObj = data;
                    if (this.resultObj.code == 200) {
                        this.navCtrl.navigateForward('/regotp/' + this.resultObj.temp_user_id);
                    } else if (this.resultObj.code == 500) {
                        this.mismatch = true;
                    } else if (this.resultObj.code == 501) {
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

goToLogin() {
  this.navCtrl.navigateForward('/login');
}

showPrivacy(){
    this.navCtrl.navigateForward('/privacy');
}

}
