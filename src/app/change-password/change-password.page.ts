import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SERVER_URL } from '../../config/config';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage {
  resultObj: any;
  model: any = new Array();
  public FrmChangePwd: FormGroup;
  mismatch: boolean = false;
  submitted: boolean = false;
  constructor(public navCtrl: NavController, private form: FormBuilder, private http: HttpClient, private loadingCtrl: LoadingController, private toastCtrl: ToastController) {
    this.model.password = '';
    this.model.newpassword = '';
    this.model.confpassword = '';
    this.FrmChangePwd = this.form.group({
      TxtPassword: [this.model.password, Validators.compose([Validators.required])],
      TxtNewPassword: [this.model.newpassword, Validators.compose([Validators.required])],
      TxtConfPassword: [this.model.confpassword, Validators.compose([Validators.required])]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangePasswordPage');
  }

  onSubmit(value) {
    if (this.model.newpassword !== this.model.confpassword){           
        return;
      }
    if (this.FrmChangePwd.valid) {
        let loading = this.loadingCtrl.create({
          message: 'Please wait...',
        });
        loading.then((loadingData) => {
          loadingData.present();
        });
        const body = {
            client_key: SERVER_URL.client_key,
            user_id: localStorage.getItem("il_user_id"),
            password: this.model.password,
            newpassword: this.model.newpassword
        };
        this.http.post(
            SERVER_URL.baseURL + '/services/changePassword',
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
                        this.navCtrl.navigateForward('/profile');
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
                      message: 'Please check your network connectivity and try logging in again..', position: 'top', duration: 2700
                    }).then((toastData) => { toastData.present(); });
                })
            );
    }
  }
}
