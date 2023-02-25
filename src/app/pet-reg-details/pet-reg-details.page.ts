import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController } from '@ionic/angular';
import { SERVER_URL } from '../../config/config';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-pet-reg-details',
  templateUrl: './pet-reg-details.page.html',
  styleUrls: ['./pet-reg-details.page.scss'],
})
export class PetRegDetailsPage {
  petType = 1;
  model: any = Array();
  petErr=false;
  resultObj:any;

  constructor(public navCtrl: NavController, private http: HttpClient,
    private loadingCtrl: LoadingController, private toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PetRegDetailsPage');
  }

  setPetType(type){
    this.petErr=false;
    this.petType = type;
    this.model.pet_type_name = '';
  }

  savePetType(){
    this.petErr=false;
    if(this.petType==3 && (this.model.pet_type_name == '')){
      this.petErr=true;
    }
    else{
      let loading = this.loadingCtrl.create({
        message: 'Please wait...',
      });
      loading.then((loadingData) => {
        loadingData.present();
      });
    const body = {
        client_key: SERVER_URL.client_key,
        pet_type: this.petType,
        pet_type_text: this.model.pet_type_name,
        user_id: localStorage.getItem("il_user_id")
    };
    this.http.post(
        SERVER_URL.baseURL + '/services/savePetType',
        body, {
        headers: new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded')
    }).subscribe(
            (data => {
              loading.then((loadingData) => { loadingData.dismiss(); });
                this.resultObj = data;
                if (this.resultObj.code == 200) {
                  this.navCtrl.navigateRoot(['/regprofile']);
                } else  {
                  this.toastCtrl.create({
                    message: 'Please check your network connectivity and try logging in again..', position: 'top', duration: 2700
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

  skipPetDetails(){
    this.navCtrl.navigateRoot(['/regprofile']);
  }
}
