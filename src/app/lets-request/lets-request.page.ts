import { Component, OnInit} from '@angular/core';
import { AlertController, NavController, LoadingController, ToastController, Platform } from '@ionic/angular';
import { SERVER_URL } from '../../config/config';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { Diagnostic } from '@awesome-cordova-plugins/diagnostic/ngx';
import { Socket } from 'ngx-socket-io';
@Component({
  selector: 'app-lets-request',
  templateUrl: './lets-request.page.html',
  styleUrls: ['./lets-request.page.scss'],
})
export class LetsRequestPage implements OnInit{
  resultObj: any;
  requestList: any = Array();
  currentLat: any;
	currentLang: any;
  constructor(public navCtrl: NavController, private http: HttpClient, private toastCtrl: ToastController,
    private alertCtrl: AlertController, private socket: Socket,private geolocation: Geolocation, private platform:Platform, 
    private loadingCtrl: LoadingController,private diagnostic: Diagnostic) {
  }

  ngOnInit() {
    this.getLetsRequest();
  }

  getLetsRequest() {
    const body = {
      client_key: SERVER_URL.client_key,
      user_id: localStorage.getItem("il_user_id")
    };
    this.http.post(
      SERVER_URL.baseURL + '/services/getLetsRequest',
      body, {
      headers: new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded')
    }).subscribe(
        (data => {
          this.resultObj = data;
          if (this.resultObj.code == 200) {
            this.requestList = this.resultObj.data;
          }
        }),
        ((err: HttpErrorResponse) => {
          this.toastCtrl.create({
            message: 'Please check your network connectivity and try logging in again..', position: 'top', duration: 2700, cssClass: "custom-failure-class"
          }).then((toastData) => { toastData.present(); });
        })
      );
  }

  async acceptLetsRequest(request: any) {
    
    this.diagnostic.isLocationEnabled().then((isEnable:boolean)=>{
      if(!isEnable){
        this.toastCtrl.create({
        message: 'Enable location to create lets.', position: 'top', duration: 2700, cssClass: "custom-failure-class"
        }).then((toastData) => { toastData.present(); });
        return;
      }
    }).catch((error)=>{
      console.log(error);
    });

    this.diagnostic.isLocationAuthorized().then((authorized)=>{
      this.diagnostic.requestLocationAuthorization(this.diagnostic.locationAuthorizationMode.ALWAYS).then((status)=>{
        if(status == this.diagnostic.permissionStatus.NOT_REQUESTED || status == this.diagnostic.permissionStatus.DENIED || status == this.diagnostic.permissionStatus.DENIED_ALWAYS){
          this.toastCtrl.create({
            message: 'Allow App location permission to create lets.', position: 'top', duration: 2700, cssClass: "custom-failure-class"
          }).then((toastData) => { toastData.present(); });
          return;
        }
      });
    }).catch((err)=>{ console.log(err); });
    
    console.log('Step3');
    const loading = this.loadingCtrl.create({
      message: 'Please wait...',
    });
    loading.then((loadingData) => {
      loadingData.present();
    });
    await this.platform.ready();
    this.geolocation.getCurrentPosition().then(resp => {
			this.currentLat = resp.coords.latitude;
			this.currentLang = resp.coords.longitude;
      var letsID = parseInt(request.lets_id);
    const body = {
      client_key: SERVER_URL.client_key,
      user_id: localStorage.getItem("il_user_id"),
      lets_id: letsID,
      current_lat: this.currentLat,
      current_lng: this.currentLang
    };
    this.http.post(
      SERVER_URL.baseURL + '/services/acceptLetsRequest',
      body, {
      headers: new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded')
    }).subscribe(
        (data => {
          loading.then((loadingData) => { loadingData.dismiss(); });
          this.resultObj = data;
          if (this.resultObj.code == 200) {
            this.toastCtrl.create({
              message: 'All the best!!!', position: 'top', duration: 2700, cssClass: "custom-success-class"
            }).then((toastData) => { toastData.present(); });
            var letsUserSocketID = this.resultObj.lets_user_socket_id;
            this.socket.emit("newaccepted", { lets_id: letsID, accepted_user_id: localStorage.getItem("il_user_id"), socket_id: letsUserSocketID });
            this.navCtrl.navigateForward('/accepted-waiting/'+letsID);
          } else {
            this.toastCtrl.create({
              message: this.resultObj.message, position: 'top', duration: 2700, cssClass: "custom-failure-class"
            }).then((toastData) => { toastData.present(); });
            this.navCtrl.navigateForward('/lets-request');
          }
        }),
        ((err: HttpErrorResponse) => {
          loading.then((loadingData) => { loadingData.dismiss(); });
          this.toastCtrl.create({
            message: 'Please check your network connectivity and try logging in again..', position: 'top', duration: 2700, cssClass: "custom-failure-class"
          }).then((toastData) => { toastData.present(); });
        })
      );
		}).catch(error => {
      this.retryAcceptLetsRequest(request);
			console.log('Error getting location', error);
		});
  }

  async retryAcceptLetsRequest(request: any){
    const alert = await this.alertCtrl.create({
      header: 'Location',
      subHeader: 'Did not find your location. Click accept to retry.',
      buttons: [{
        text: 'Accept',
        role: 'cancel',
        handler: () => {
          this.acceptLetsRequest(request);
        }
      }]
    });
    await alert.present();
  }


  ignoreLetsRequest(request: any) {
    const body = {
      client_key: SERVER_URL.client_key,
      lets_id: request.lets_id,
      user_id: localStorage.getItem("il_user_id")
    };
    this.http.post(
      SERVER_URL.baseURL + '/services/ignoreLetsRequest',
      body, {
      headers: new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded')
    }).subscribe(
        (data => {
          this.resultObj = data;
          if (this.resultObj.code == 200) {
            this.requestList.splice(this.requestList.indexOf(request), 1);
          }
        }),
        ((err: HttpErrorResponse) => {
          this.toastCtrl.create({
            message: 'Please check your network connectivity and try logging in again..', position: 'top', duration: 2700, cssClass: "custom-failure-class"
          }).then((toastData) => { toastData.present(); });
        })
      );
  }

  reportLets(request: any) {
    const body = {
      client_key: SERVER_URL.client_key,
      report_user_id: request.user_id,
      lets_id: request.lets_id,
      user_id: localStorage.getItem("il_user_id")
    };
    this.http.post(
      SERVER_URL.baseURL + '/services/reportLets',
      body, {
      headers: new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded')
    }).subscribe(
        (data => {
          this.resultObj = data;
          if (this.resultObj.code == 200) {
            request.report_flag = 1;
            this.toastCtrl.create({
              message: this.resultObj.message, position: 'top', duration: 2700, cssClass: "custom-success-class"
            }).then((toastData) => { toastData.present(); });
          }
        }),
        ((err: HttpErrorResponse) => {
          this.toastCtrl.create({
            message: 'Please check your network connectivity and try logging in again..', position: 'top', duration: 2700, cssClass: "custom-failure-class"
          }).then((toastData) => { toastData.present(); });
        })
      );
  }
}
