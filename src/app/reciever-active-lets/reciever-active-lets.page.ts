import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController, Platform } from '@ionic/angular';
import { SERVER_URL } from '../../config/config';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Swiper, Navigation, Pagination, Scrollbar, EffectCoverflow, EffectFade} from 'swiper';
Swiper.use([Navigation, Pagination, Scrollbar, EffectCoverflow, EffectFade]);
declare const google: any;


@Component({
  selector: 'app-reciever-active-lets',
  templateUrl: './reciever-active-lets.page.html',
  styleUrls: ['./reciever-active-lets.page.scss'],
})
export class RecieverActiveLetsPage {
  profileImages: any = Array();
  profile_pic: any;
  user_name: any;
  user_age: any;
  vaccination: any;
  lets_lat: any;
  lets_lng: any;
  galleryList: any;
  selfieGalleryList:any = new Array();
  resultObj: any;
  model: any = new Array();
  letsID: any;
  map: any = null;
  currmarker: any;
  constructor(public navCtrl: NavController, private http: HttpClient,
    public platform: Platform, private toastCtrl: ToastController, private activateRoute: ActivatedRoute, private router: Router) {
    this.letsID=this.activateRoute.snapshot.paramMap.get('letsID');
  }

  ionViewDidEnter() {
    this.getActiveLetsDetails();
  }

  getActiveLetsDetails() {
    this.http.post(
      SERVER_URL.baseURL + '/services/getActiveLetsDetails',
      {
        client_key: SERVER_URL.client_key,
        lets_id: this.letsID,
      }, {
      headers: new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded')
    })
      .subscribe(data => {
        this.resultObj = data;
        if (this.resultObj.code == 200) {
          this.user_name = this.resultObj.name;
          this.user_age = this.resultObj.age;
          this.vaccination = this.resultObj.vaccination;
          this.lets_lat = this.resultObj.lets_lat;
          this.lets_lng = this.resultObj.lets_lng;
          this.profile_pic = this.resultObj.profile_pic;
          this.galleryList = this.resultObj.profile_gallery;
          this.selfieGalleryList = this.resultObj.selfi_gallery;
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
        // Default parameters
        slidesPerView: 1,
        spaceBetween: 20,
        effect: "fade",
        allowTouchMove: false,
        fadeEffect: {
          crossFade: true
        },
        navigation: {
          nextEl: '.swiper-button-next-inner',
          prevEl: '.swiper-button-prev-inner',
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          renderBullet: function (index, className) {
            return '<span class="' + className + '">' + (index + 1) + '</span>';
          },
        },
        on: {
          slideChange: function (events) {
          },
        }
      });
    })
  }

  loadAddrMap() {
    const latlng = new google.maps.LatLng(this.lets_lat, this.lets_lng);
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
    let markerPOinter = this.lets_lat + ',' + this.lets_lng;
    google.maps.event.addListener(this.currmarker, "click", function() {
      window.open("https://www.google.com/maps/search/?api=1&query="+markerPOinter)
    });
  }

  showProfile() {
    this.navCtrl.navigateForward('/profile');
  }
  
  showDiscover() {
    this.navCtrl.navigateForward('/discover');
	}
  
  goToHome() {
    this.navCtrl.navigateForward('/home');
  }
}
