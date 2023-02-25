import { Component } from '@angular/core';
import { NavController, Platform, ToastController, AlertController } from '@ionic/angular';
import { SERVER_URL } from '../../config/config';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Swiper, Navigation, Pagination, Scrollbar, EffectCoverflow, EffectFade, Manipulation} from 'swiper';
Swiper.use([Navigation, Pagination, Scrollbar, EffectCoverflow, EffectFade, Manipulation]);

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage {

    resultObj: any;
    profiles: any = Array();
    swiper: any;
    constructor(public navCtrl: NavController, public http: HttpClient, public platform: Platform, 
        public toastCtrl: ToastController, public alertCtrl: AlertController) {
        this.getDiscoverProfile();
    }

    ionViewDidEnter() {
        this.getDiscoverProfile();
        setTimeout(() => {
            this.initializeGallery();
        }, 1500);
    }

    getDiscoverProfile() {
        this.http.post(
            SERVER_URL.baseURL + '/services/getDiscoverProfile',
            {
                client_key: SERVER_URL.client_key,
                user_id: localStorage.getItem("il_user_id")
            }, {
            headers: new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded')
        })
            .subscribe(data => {
                this.resultObj = data;
                if (this.resultObj.code == 200) {
                    this.profiles = this.resultObj.profiles;
                }
            },
                ((err: HttpErrorResponse) => { })
            );
    }

    initializeGallery() {
        this.platform.ready().then(() => {
            var thisClass = this;
            this.swiper = new Swiper('.swiper-container-outer', {
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
                    slideChange: function (events) {
                        // console.log(thisClass.profiles);
                    },
                }
            });
            var swiperInner = new Swiper('.swiper-container-inner', {
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
                        // console.log(thisClass.profiles);
                    },

                }
            });
        })   
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

    reportUser(user_id) {
        this.http.post(
            SERVER_URL.baseURL + '/services/reportUser',
            {
                client_key: SERVER_URL.client_key,
                user_id: localStorage.getItem("il_user_id"),
                reported_user_id: user_id
            }, {
            headers: new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded')
        }).subscribe(data => {
                this.resultObj = data;
                if (this.resultObj.code == 200) {
                    this.showAlert('Flagged','User has been reported.');
                    this.swiper.removeSlide(this.swiper.activeIndex);
                    this.swiper.slideTo(this.swiper.activeIndex + 1);
                }else if(this.resultObj.code == 500){
                    this.showAlert('Flagged','User is already reported.');
                    this.swiper.slideTo(this.swiper.activeIndex + 1);
                }
            },
                ((err: HttpErrorResponse) => { })
            );
    }

    
    async showAlert(header, msg) {
        const alert = await this.alertCtrl.create({
        cssClass: 'my-custom-class',
        header: header,
        subHeader: '',
        message: msg,
        buttons: ['OK']
        });
        await alert.present();
        const { role } = await alert.onDidDismiss();
    }

}
