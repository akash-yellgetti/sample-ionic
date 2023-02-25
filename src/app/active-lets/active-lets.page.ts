import { Component } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { SERVER_URL } from '../../config/config';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Swiper, Navigation, Pagination, Scrollbar, EffectCoverflow, EffectFade} from 'swiper';
Swiper.use([Navigation, Pagination, Scrollbar, EffectCoverflow, EffectFade]);
import { Socket } from 'ngx-socket-io';
import { ActivatedRoute } from '@angular/router';
declare const google: any;
@Component({
  selector: 'app-active-lets',
  templateUrl: './active-lets.page.html',
  styleUrls: ['./active-lets.page.scss'],
})
export class ActiveLetsPage {
  profileImages: any = Array();
  profile_pic: any;
  user_name: any;
  vaccination: any;
  user_age: any;
  lets_lat: any;
  lets_lng: any;
  galleryList: any;
  resultObj: any;
  model: any = new Array();
  letsID:any;
  map: any = null;
  currmarker: any;
  constructor(public navCtrl: NavController, private http: HttpClient,private activateRoute: ActivatedRoute, 
    public platform: Platform, private socket: Socket) {
    this.letsID = this.activateRoute.snapshot.paramMap.get('letsID'); 
  }

  ngAfterViewInit() {
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
    }).subscribe(data => {
        this.resultObj = data;
        if (this.resultObj.code == 200) {
          this.user_name = this.resultObj.accepted_name;
          this.user_age = this.resultObj.accepted_age;
          this.vaccination = this.resultObj.accepted_vaccination;
          this.lets_lat = this.resultObj.accepted_user_lat;
          this.lets_lng = this.resultObj.accepted_user_lng;
          this.galleryList = this.resultObj.accepted_profile_gallery;
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
  
  goToHome(){
    this.navCtrl.navigateForward('/home');
  }
}
