import { Component } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { SERVER_URL } from '../../config/config';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile-tag',
  templateUrl: './profile-tag.page.html',
  styleUrls: ['./profile-tag.page.scss'],
})
export class ProfileTagPage {

  resultObj: any;
  tagList: any;
  selectedArray = [];
  unSelectedArray = [];
  public FrmTagProfile: FormGroup;
  checked: boolean = false;
  constructor(public navCtrl: NavController, private http: HttpClient, 
    private form: FormBuilder, private toastCtrl: ToastController) {
    this.FrmTagProfile = this.form.group({
      cbox: [false, Validators.required]
    });
  }

  ionViewDidEnter() {
    this.getTags();
  }

  getTags() {
    this.http.post(
      SERVER_URL.baseURL + '/services/getTags',
      {
        client_key: SERVER_URL.client_key,
        user_id: localStorage.getItem("il_user_id")
      }, {
      headers: new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded')
    })
      .subscribe(data => {
        this.resultObj = data;
        if (this.resultObj.code == 200) {
          this.tagList = this.resultObj.result;
        }
      },
        ((err: HttpErrorResponse) => { })
      );
  }

  checkedOrNot(value: any, event: any) {
    let index;
    if (event.target.checked === true) {
      this.selectedArray.push(value);
    } else {
      index = this.selectedArray.indexOf(value);
      if (index > -1) {
        this.selectedArray.splice(index, 1);
      }
      this.unSelectedArray.push(value);
    }

    console.log('Selected :'+this.selectedArray);
    console.log('Un - Selected :'+this.unSelectedArray);
  };

  validateTag() {
    this.http.post(
      SERVER_URL.baseURL + '/services/saveProfileTags',
      {
        client_key: SERVER_URL.client_key,
        user_id: localStorage.getItem("il_user_id"),
        select_tag_id: this.selectedArray,
        unselect_tag_id: this.unSelectedArray
      }, {
      headers: new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded')
    })
      .subscribe(data => {
        this.resultObj = data;
        if (this.resultObj.code == 200) {
          this.toastCtrl.create({
            message: this.resultObj.message, position: 'top', duration: 2700, cssClass: "custom-success-class"
          }).then((toastData) => { toastData.present(); });
        } else {
          this.toastCtrl.create({
            message: "Something went wrong, please try again..", position: 'top', duration: 2700, cssClass: "custom-failure-class"
          }).then((toastData) => { toastData.present(); });
        }
      },
        ((err: HttpErrorResponse) => { })
      );
    }
}
