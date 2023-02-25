import { Component } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { SERVER_URL } from '../../config/config';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';
import { ActivatedRoute } from '@angular/router';
import { Events } from '../services/events';

@Component({
  selector: 'app-accepted-waiting',
  templateUrl: './accepted-waiting.page.html',
  styleUrls: ['./accepted-waiting.page.scss'],
})
export class AcceptedWaitingPage {
  letsID: any;
  resultObj: any;
  constructor(public navCtrl: NavController, private http: HttpClient, private toastCtrl: ToastController,
    private socket:Socket, private events: Events, private activateRoute: ActivatedRoute,) {
    this.letsID = this.activateRoute.snapshot.paramMap.get('letsID'); 

    // this.platform.ready().then(() => {
    //   this.acceptPartner().subscribe((data)=>{
    //     console.log("acceptPartner waiting invoked");
    //     console.log(data);
    //     this.navCtrl.setRoot(HomePage);
    //   });
    //   this.rejectPartner().subscribe((data)=>{
    //     this.navCtrl.setRoot(HomePage);
    //   });
    //   this.cancelPartner().subscribe((data)=>{
    //     this.navCtrl.setRoot(HomePage);
    //   });
    // });
    // this.socket.on('acceptpartner', (data) => {
    //   console.log("acceptPartner waiting invoked inside socket");
    // });
    this.events.subscribe("show_partner_active",(data)=>{
      this.navCtrl.navigateRoot('/reciever-active-lets/'+data.lets_id);
    })
    this.events.subscribe("show_Lets_cancelled",(data)=>{
      this.toastCtrl.create({ message: "Your partner cancelled lets", duration: 3000, position: 'top', cssClass: "custom-failure-class" })
     .then((toastData) => { toastData.present(); });
      this.navCtrl.navigateRoot('/home');
    })
  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad AcceptedWaitingPage');
  }

  cancelLetsByReceiver(letsID) {
    const body = {
      client_key: SERVER_URL.client_key,
      lets_id: letsID,
      user_id: localStorage.getItem("il_user_id")
    };
    this.http.post(
      SERVER_URL.baseURL + '/services/cancelLetsByReceiver',
      body, {
      headers: new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded')
    }).subscribe(
        (data => {
          this.resultObj = data;
          if (this.resultObj.code == 200) {
            this.toastCtrl.create({ message: this.resultObj.message, duration: 3000, position: 'top', cssClass: "custom-success-class" })
            .then((toastData) => { toastData.present(); });
            var letsUserSocketID = this.resultObj.lets_user_socket_id;
            this.socket.emit("cancelbypartner", {lets_id: letsID, socket_id: letsUserSocketID});
            this.navCtrl.navigateRoot('/home');
          } else {
            this.toastCtrl.create({ message: this.resultObj.message, duration: 3000, position: 'top', cssClass: "custom-failure-class" })
            .then((toastData) => { toastData.present(); });
          }
        }),
        ((err: HttpErrorResponse) => {
          this.toastCtrl.create({ message: 'Please check your network connectivity and try logging in again..', duration: 3000, position: 'top', cssClass: "custom-failure-class" })
          .then((toastData) => { toastData.present(); });
        })
      );
  }

  // acceptPartner() {
  //   let observable = new Observable(observer => {
  //     console.log("acceptPartner waiting1 invoked");
  //     this.socket.on('acceptpartner', (data) => {
  //       console.log("acceptPartner waiting2 invoked");
  //       observer.next(data);
  //     });
  //   })
  //   return observable;
  // }

  // rejectPartner() {
  //   let observable = new Observable(observer => {
  //     this.socket.on('rejectpartner', (data) => {
  //       observer.next(data);
  //     });
  //   })
  //   return observable;
  // }

  // cancelPartner() {
  //   let observable = new Observable(observer => {
  //     this.socket.on('cancelpartner', (data) => {
  //       observer.next(data);
  //     });
  //   })
  //   return observable;
  // }
}

