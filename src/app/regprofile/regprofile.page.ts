import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController, Platform } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SERVER_URL } from '../../config/config';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Events } from '../services/events';

@Component({
  selector: 'app-regprofile',
  templateUrl: './regprofile.page.html',
  styleUrls: ['./regprofile.page.scss'],
})
export class RegprofilePage {
  resultObj: any;
  model: any = new Array();
  public FrmRegProfile: FormGroup;
  dupEmailFlag: Boolean = false;
  submitted: Boolean = false;
  letsTagList: any;
  genderErr = false;
  constructor(public navCtrl: NavController, public plt: Platform, private toastCtrl: ToastController, 
    private form: FormBuilder, private http: HttpClient, private loadingCtrl: LoadingController, private events: Events) {
      this.model.name = '';
      this.model.email = '';
      this.model.gender = '';
      this.model.mstatus = '';
      this.FrmRegProfile = this.form.group({
          TxtName: [this.model.name, Validators.compose([Validators.required])],
          TxtEmail: [this.model.email, Validators.compose([Validators.required, Validators.email])],
          DdlGender: [this.model.gender, Validators.compose([Validators.required])],
          DdlVaccination: [this.model.vaccination, Validators.compose([Validators.required])],
          DdlMaritalStatus: [this.model.mstatus, Validators.compose([Validators.required])]
      });
  }

  ionViewDidEnter() {
      console.log('ionViewDidLoad RegprofilePage');
      this.getGenders();
  }
  onSubmit(value) {
    this.genderErr = false;
    if(parseInt(this.model.gender)==0){
      this.genderErr = true;
      return;
    }
      this.dupEmailFlag = false;
      if (this.FrmRegProfile.valid) {
          let loading = this.loadingCtrl.create({
            message: 'Please wait...',
          });
          loading.then((loadingData) => {
            loadingData.present();
          });
          const body = {
              client_key: SERVER_URL.client_key,
              user_id: localStorage.getItem("il_user_id"),
              name: this.model.name,
              email: this.model.email,
              gender_id: this.model.gender,
              vaccination_status: this.model.vaccination,
              marital_status: this.model.mstatus,
          };
          this.http.post(
              SERVER_URL.baseURL + '/services/saveRegProfile',
              body, {
              headers: new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded')
          }).subscribe(
                  (data => {
                    loading.then((loadingData) => { loadingData.dismiss(); });
                      this.resultObj = data;
                      if (this.resultObj.code == 200) {
                          localStorage.setItem("il_profile_complete_flag", this.resultObj.profile_complete_flag);
                          this.navCtrl.navigateForward('/profile-gallery');
                      } else if (this.resultObj.code == 502) {
                          this.dupEmailFlag = true;
                      }
                      else {
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

  getGenders() {
    const body = {
      client_key: SERVER_URL.client_key,
      user_id: localStorage.getItem("il_user_id")
    };
    this.http.post(
      SERVER_URL.baseURL + '/services/getGenders',
      body, {
      headers: new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded')
    }).subscribe(
        (data => {
          this.resultObj = data;
          if (this.resultObj.code == 200) {
            this.letsTagList = this.resultObj.data;
          }
        }),
        ((err: HttpErrorResponse) => { })
      );
  }
}
