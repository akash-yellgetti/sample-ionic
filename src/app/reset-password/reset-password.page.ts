import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, ToastController, Platform } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SERVER_URL } from '../../config/config';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage{
  resultObj: any;
    model: any = new Array();
    public FrmResetPwd: FormGroup;
    submitted=false;
    mismatch: boolean = false;
  constructor(public navCtrl: NavController, public plt: Platform, private toastCtrl: ToastController, 
    private form: FormBuilder, private http: HttpClient, private loadingCtrl: LoadingController, 
    private activateRoute: ActivatedRoute, private router: Router) { 
    this.model.user_id=this.activateRoute.snapshot.paramMap.get('userID');
    this.model.otp = '';
    this.model.password = '';
    this.model.confpassword = '';
    this.FrmResetPwd = this.form.group({
        TxtOTP: [this.model.otp, Validators.compose([Validators.required])],
        TxtPassword: [this.model.password, Validators.compose([Validators.required])],
        TxtConfPassword: [this.model.confpassword, Validators.compose([Validators.required])]
    });
}

ngAfterViewInit() {
}

ionViewDidLoad() {
    console.log('ionViewDidLoad ResetPasswordPage');
}

onSubmit(value){
    if (this.model.password !== this.model.confpassword){           
        return;
      }
    if (this.FrmResetPwd.valid) {
        let loading = this.loadingCtrl.create({
          message: 'Please wait...',
        });
        loading.then((loadingData) => {
          loadingData.present();
        });
        const body = {
            client_key: SERVER_URL.client_key,
            user_id: this.model.user_id,
            otp: this.model.otp,
            password: this.model.password,
            confpassword: this.model.confpassword
        };
        this.http.post(
            SERVER_URL.baseURL + '/services/saveResetPwd',
            body, {
            headers: new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded')
        }).subscribe(
                (data => {
                  loading.then((loadingData) => { loadingData.dismiss(); });
                    this.resultObj = data;
                    if (this.resultObj.code == 200) {
                      this.toastCtrl.create({
                        message: "Password changed successfully.", position: 'top', duration: 2700
                      }).then((toastData) => { toastData.present(); });
                      this.navCtrl.navigateForward('/login');
                    }else if (this.resultObj.code == 503) {
                        this.mismatch=true;
                        this.toastCtrl.create({
                          message: this.resultObj.message, position: 'top', duration: 2700
                        }).then((toastData) => { toastData.present(); });
                    } else {
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
}
