import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController, Platform } from '@ionic/angular';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { SplashScreen } from '@capacitor/splash-screen';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { SERVER_URL } from '../config/config';
import { Events } from 'src/app/services/events';
import { Device } from '@capacitor/device';
import { Socket } from 'ngx-socket-io';
import { present } from '@ionic/core/dist/types/utils/overlays';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  resultObj: any;
  deviceID: any;
  lets: any;
  socketID: any = "";
  constructor(public navCtrl: NavController, 
    private toastCtrl: ToastController, private http: HttpClient, private loadingCtrl: LoadingController, 
    private geolocation: Geolocation, private events: Events, private socket: Socket, private platform: Platform) {
      events.subscribe('userlogout', () => {
        localStorage.removeItem("il_user_id");
        localStorage.removeItem("il_country_phone_code");
        localStorage.removeItem("il_country_id");
        localStorage.removeItem("il_mobile");
        localStorage.removeItem("il_email");
        localStorage.removeItem("il_profile_complete_flag");
        localStorage.removeItem("il_profile_pic");
        this.navCtrl.navigateRoot('/login');
      });
    this.initializeApp();

  }

  initializeApp() {
    /* To make sure we provide the fastest app loading experience
       for our users, hide the splash screen automatically
       when the app is ready to be used:

        https://capacitor.ionicframework.com/docs/apis/splash-screen#hiding-the-splash-screen
    */
   
    this.platform.ready().then(() => {
        SplashScreen.hide();
        this.events.subscribe('loc_device_update', (data: any) => {
          this.updateUserLocDeviceInfo(data.userID);
        });
        this.getDeviceID();

      //Socket Connection and updating socket value
      this.socket.on("connect", () => {      
        this.socketID = this.socket.ioSocket.id;
        localStorage.setItem("il_user_socket_id", this.socketID);         
        if (localStorage.getItem("il_user_id") !== null) {
          this.updateSocketID();
        }
      });
      this.socket.on("reconnect", () => {
        this.socketID =  this.socket.ioSocket.id;
        localStorage.setItem("il_user_socket_id", this.socketID);
        if (localStorage.getItem("il_user_id") !== null) {
          this.updateSocketID();
        }
      });
      this.socket.on("error", (err) => {
        console.log(err);
      });

      if (localStorage.getItem("il_user_id") == null) {
        this.navCtrl.navigateRoot('/login');
      } else {
        if (parseInt(localStorage.getItem("il_profile_complete_flag")) == 0) {
          this.navCtrl.navigateRoot('/regprofile');
        } else if (parseInt(localStorage.getItem("il_profile_complete_flag")) == 2) {
          this.navCtrl.navigateRoot('/profile-gallery');
        } else {
          //1,3-complete
          this.navCtrl.navigateRoot('/home');
          // this.nav.push(NoLetsUserPage,{message:"Lets cancelled. No nearby user found."});
        }
      }
      this.newLets().subscribe(lets => {
        this.lets = lets;
        this.navCtrl.navigateRoot('/lets-request');
      });
      this.getNotifications().subscribe(lets => {
        this.lets = lets;
        this.navCtrl.navigateRoot('/lets-request');
      });
      this.getAcceptedLets().subscribe((lets) => {
        this.lets = lets;
        this.navCtrl.navigateRoot('/accepted-lets/' + this.lets.lets_id+"/"+this.lets.accepted_user_id);
      });
      this.acceptPartner().subscribe((lets) => {
        this.lets = lets;
        this.events.publish("show_partner_active",{lets_id: this.lets.lets_id});
      });
      this.cancelPartner().subscribe((lets) => {
        this.lets = lets;
        this.events.publish("show_Lets_cancelled",{lets_id: this.lets.lets_id});
      });
      this.rejectPartner().subscribe((lets) => {
        this.lets = lets;
        this.events.publish("show_Lets_cancelled",{lets_id: this.lets.lets_id});
      });
      this.getRejectLets().subscribe(lets => {
        this.lets = lets;
        this.toastCtrl.create({
          message: 'Request Rejected.', position: 'top', duration: 2700
        }).then((toastData) => { toastData.present(); });
        this.navCtrl.navigateRoot('/home');
      });
    });
  }

  // user got a itslets request
  newLets() {
    let observable = new Observable(observer => {
      this.socket.on('new_lets', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }

  getNotifications() {
    let observable = new Observable(observer => {
      this.socket.on('sendnotifi', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }

  // someone accepted user itslets
  getAcceptedLets() {
    let observable = new Observable(observer => {
      this.socket.on('newaccepted', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }

  newRejected() {
    let observable = new Observable(observer => {
      this.socket.on('newrejected', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }

  acceptPartner() {
    let observable = new Observable(observer => {
      this.socket.on('acceptpartner', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }

  rejectPartner() {
    let observable = new Observable(observer => {
      this.socket.on('rejectpartner', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }

  cancelPartner() {
    let observable = new Observable(observer => {
      this.socket.on('cancelpartner', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }

  // not used yet
  // user lets accept got rejected
  getRejectLets() {
    let observable = new Observable(observer => {
      this.socket.on('rejectaccepted', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }

  // not used yet
  // user lets accept got rejected
  getCancelLets() {
    let observable = new Observable(observer => {
      this.socket.on('cancelaccepted', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }
  
  updateSocketID() {
    this.http.post(
      SERVER_URL.baseURL + '/services/updateSocketID',
      {
        client_key: SERVER_URL.client_key,
        user_id: localStorage.getItem("il_user_id"),
        socket_id: this.socketID
      }, {
      headers: new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded')
    }).subscribe(data => {
        this.resultObj = data;
        if (this.resultObj.code == 200) {

        } else {
          this.toastMsg(this.resultObj.message);
        }
      },((err: HttpErrorResponse) => { }));
  }

  getDeviceID = async () => {
    const info = await Device.getId();
    this.deviceID = info.uuid;
  };

  updateUserLocDeviceInfo(userID) {
    var isIOSDevice = false;
    var deviceID = "";
    var currentLat = 0;
    var currentLang = 0;
    var deviceType = 2;
    this.updateUserDeviceType(userID, deviceType)
    this.geolocation.getCurrentPosition().then(resp => {
      currentLat = resp.coords.latitude
      currentLang = resp.coords.longitude
      this.updateUserLocation(userID, currentLat, currentLang)
    }).catch(error => {
      console.log('Error getting location', error);
    });
   
    this.updateUserDeviceID(userID, this.deviceID);
  }

  async toastMsg(msg: string){
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 1000,
      position: 'top'
    });
    toast.present();
  }

  updateUserLocation(userID, currentLat, currentLang) {
    this.http.post(
      SERVER_URL.baseURL + '/services/updateUserLocation',
      {
        client_key: SERVER_URL.client_key,
        user_id: userID,
        current_lat: currentLat,
        current_lang: currentLang
      }, {
      headers: new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded')
    }).subscribe(
      (data => {
        this.resultObj = data;
        if (this.resultObj.code == 200) {

        } else {
          //this.toastMsg(this.resultObj.message);
        }
      }),
      ((err: HttpErrorResponse) => {
        this.toastMsg('Please check your network connectivity and try logging in again..');
      })
    );
  }

  updateUserDeviceType(userID, deviceType) {
    this.http.post(
      SERVER_URL.baseURL + '/services/updateUserDeviceType',
      {
        client_key: SERVER_URL.client_key,
        user_id: userID,
        device_type: deviceType
      }, {
      headers: new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded')
    }).subscribe(
      (data => {
        this.resultObj = data;
        if (this.resultObj.code == 200) {

        } else {
          this.toastMsg(this.resultObj.message);
        }
      }),
      ((err: HttpErrorResponse) => {
        this.toastMsg('Please check your network connectivity and try logging in again..');
      })
    );
  }

  updateUserDeviceID(userID, deviceID) {
    this.http.post(
      SERVER_URL.baseURL + '/services/updateUserDeviceID',
      {
        client_key: SERVER_URL.client_key,
        user_id: userID,
        device_id: deviceID
      }, {
      headers: new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded')
    }).subscribe(
      (data => {
        this.resultObj = data;
        if (this.resultObj.code == 200) {

        } else {
          this.toastMsg(this.resultObj.message);
        }
      }),
      ((err: HttpErrorResponse) => {
        this.toastMsg('Please check your network connectivity and try logging in again..');
      })
    );
  }

}
