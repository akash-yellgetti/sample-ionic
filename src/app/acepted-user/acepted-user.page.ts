import { Component } from '@angular/core';
import { NavController, AlertController, ToastController, Platform } from '@ionic/angular';
import { SERVER_URL } from '../../config/config';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Swiper, Navigation, Pagination, Scrollbar, EffectCoverflow, EffectFade} from 'swiper';
Swiper.use([Navigation, Pagination, Scrollbar, EffectCoverflow, EffectFade]);
import { Socket } from 'ngx-socket-io';
import { ActivatedRoute } from '@angular/router';
declare const google: any;

@Component({
  selector: 'app-acepted-user',
  templateUrl: './acepted-user.page.html',
  styleUrls: ['./acepted-user.page.scss'],
})
export class AceptedUserPage{

  profile_pic: any;
  user_name: any;
  vaccination: any;
  user_age: any;
  accepted_user_lat: any;
  accepted_user_lng: any;
  galleryList: any;
  resultObj: any;
  model: any = new Array();
  letsID:any;
  acceptedUserID:any;
  map: any = null;
  currmarker: any;
  constructor(public navCtrl: NavController, private activateRoute: ActivatedRoute, private http: HttpClient,
    public platform: Platform, private socket: Socket, private alertCtrl: AlertController, private toastCtrl: ToastController) {
    this.letsID = this.activateRoute.snapshot.paramMap.get('letsID'); 
    this.acceptedUserID = this.activateRoute.snapshot.paramMap.get('accpUserID'); 
  }

  ngAfterViewInit() {
    this.getLetsPartnerDetails();
  }

  getLetsPartnerDetails() {
    this.http.post(
      SERVER_URL.baseURL + '/services/getLetsPartnerDetails',
      {
        client_key: SERVER_URL.client_key,
        lets_id: this.letsID,
        accepted_user_id: this.acceptedUserID
      }, {
      headers: new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded')
    })
      .subscribe(data => {
        this.resultObj = data;
        if (this.resultObj.code == 200) {
          this.user_name = this.resultObj.name;
          this.vaccination = this.resultObj.vaccination;
          this.user_age = this.resultObj.age;
          this.accepted_user_lat = this.resultObj.accepted_user_lat;
          this.accepted_user_lng = this.resultObj.accepted_user_lng;
          this.profile_pic = this.resultObj.profile_pic;
          this.galleryList = this.resultObj.gallery;
          this.loadAddrMap();
          setTimeout(() => {
            this.initializeGallery();
          }, 1500);
        }
      },
        ((err: HttpErrorResponse) => { })
      );
  }

  initializeGallery() {
    this.platform.ready().then(() => {
      new Swiper('.swiper-container-inner', {
        touchStartForcePreventDefault: true,
        speed: 500,
        slidesPerView: 1,
        spaceBetween: 20,
        effect: "coverflow",
        coverflowEffect: {
            rotate: 30,
            slideShadows: false,
            depth: 0
        },
        on: {
            slideChange: function (events) {},
        }        
      });
    })
  }

  cancelLets() {
    const body = {
      client_key: SERVER_URL.client_key,
      user_id: localStorage.getItem("il_user_id")
    };
    this.http.post(
      SERVER_URL.baseURL + '/services/cancelLets',
      body, {
      headers: new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded')
    }).subscribe(
        (data => {
          this.resultObj = data;
          if (this.resultObj.code == 200) {
            this.toastCtrl.create({ message: this.resultObj.message, duration: 3000, position: 'top', cssClass: "custom-success-class"})
            .then((toastData) => { toastData.present(); });
            var partnerSocketID = this.resultObj.partner_socket_id;
            if(partnerSocketID!=""){
              this.socket.emit("cancelpartner", { lets_id: this.letsID, socket_id: partnerSocketID });
            }
            this.navCtrl.navigateForward('/home');
          } else {
            this.toastCtrl.create({ message: this.resultObj.message, duration: 3000, position: 'top', cssClass: "custom-failure-class"})
            .then((toastData) => { toastData.present(); });
          }
        }),
        ((err: HttpErrorResponse) => {
          this.toastCtrl.create({ message: 'Please check your network connectivity and try logging in again..', duration: 3000, position: 'top', cssClass: "custom-failure-class"})
          .then((toastData) => { toastData.present(); });
        })
      );
  }

  acceptLetsPartner() {
    this.navCtrl.navigateForward('/lets-selfi/'+this.letsID+'/'+this.acceptedUserID);
  }

  // acceptLetsPartner() {
  //   const body = {
  //     client_key: SERVER_URL.client_key,
  //     user_id: localStorage.getItem("il_user_id"),
  //     accepted_user_id: this.acceptedUserID
  //   };
  //   this.http.post(
  //     SERVER_URL.baseURL + '/services/acceptLetsPartner',
  //     body, {
  //     headers: new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded')
  //   }).timeout(30000)
  //     .subscribe(
  //       (data => {
  //         this.resultObj = data;
  //         if (this.resultObj.code == 200) {
  //           let toast = this.toastCtrl.create({ message: this.resultObj.message, duration: 3000, position: 'top', cssClass: "custom-success-class" });
  //           toast.present();
  //           var partnerSocketID = this.resultObj.partner_socket_id;
  //           this.socket.emit("acceptpartner", { lets_id: this.letsID, socket_id: partnerSocketID });
  //           this.navCtrl.push(HomePage);
  //         } else {
  //           let toast = this.toastCtrl.create({ message: this.resultObj.message, duration: 3000, position: 'top', cssClass: "custom-failure-class" });
  //           toast.present();
  //         }
  //       }),
  //       ((err: HttpErrorResponse) => {
  //         let toast = this.toastCtrl.create({ message: 'Please check your network connectivity and try logging in again..', duration: 3000, position: 'top', cssClass: "custom-failure-class" });
  //         toast.present();
  //       })
  //     );
  // }

  promptRejectLetsPartner() {
			let alert = this.alertCtrl.create({
				header: 'Confirm',
				message: 'Are you sure you want to reject?',
				buttons: [{
					text: 'Yes',
					cssClass: 'alert-success',
					handler: () => {
						this.rejectLetsPartner();
					  }
				  },{
            text: 'No',
            handler: () => {
              }
            }
				]
			}).then((res) => { res.present();});
	}

  rejectLetsPartner() {
    const body = {
      client_key: SERVER_URL.client_key,
      lets_id: this.letsID,
      user_id: localStorage.getItem("il_user_id"),
      accepted_user_id: this.acceptedUserID
    };
    this.http.post(
      SERVER_URL.baseURL + '/services/rejectLetsPartner',
      body, {
      headers: new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded')
    }).subscribe(
        (data => {
          this.resultObj = data;
          if (this.resultObj.code == 200) {
            this.toastCtrl.create({ message: this.resultObj.message, duration: 3000, position: 'top', cssClass: "custom-success-class" })
            .then((toastData) => { toastData.present(); });
            var partnerSocketID = this.resultObj.partner_socket_id;
            this.socket.emit("rejectpartner", { lets_id: this.letsID, socket_id: partnerSocketID });
            this.navCtrl.navigateForward('/home');
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


  loadAddrMap() {
    const latlng = new google.maps.LatLng(this.accepted_user_lat, this.accepted_user_lng);
    this.map = new google.maps.Map(document.getElementById("add-map-holder"), {
        zoom: 17,
        mapTypeControlOptions: {
          mapTypeIds: []
        },
        fullscreenControl: false,
        center: latlng,
        gestureHandling: 'greedy',
        rotateControl: true,
        streetViewControl: false,
        zoomControl: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.LEFT_BOTTOM
        }
    });
    this.currmarker = new google.maps.Marker({
        position: latlng,
        title: "Current Location",
        draggable: false
    });
    this.currmarker.setMap(this.map);
  }
}
