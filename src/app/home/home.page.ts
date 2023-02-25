import { Component} from '@angular/core';
import { AlertController, NavController, LoadingController, ToastController, Platform } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { Diagnostic } from '@awesome-cordova-plugins/diagnostic/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@awesome-cordova-plugins/native-geocoder/ngx';
import { Socket } from 'ngx-socket-io';
import { Device } from '@capacitor/device';
import { ActivatedRoute, Router } from '@angular/router';
import { FCM } from '@awesome-cordova-plugins/fcm/ngx';
import { Events } from '../services/events';
import { SERVER_URL } from '../../config/config';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage  {
	resultObj: any;
	letsTagList: any;
	model: any = new Array();
	letsKeywords: any = new Array();
	FrmCreateLets: FormGroup;
	runTimer: boolean = false;
	hasStarted: boolean = false;
	remainingTime: any;
	timeInSeconds: any;
	displayTime: any;
	hasFinished: boolean = false;
	disableFormFlag: boolean = false;
	readOnlyFlag: boolean = false;
	disableFlag: boolean = false;
	currentLat: any;
	currentLang: any;
	currentAddress: any = "";
	submitted = false;
	keywordMsg = "Select keyword";
	restrictedWordErr = false;
	public hasPermission: boolean;
	public token: string;
	public deviceID: string;
	osPlatform = 1;
	tempLetsID: any;
  	letsID = 0;
	totalAvailableUsers = 0;
	constructor(public navCtrl: NavController, private events: Events, private http: HttpClient,
		private form: FormBuilder, private alertCtrl: AlertController, private toastCtrl: ToastController,
		private loadingCtrl: LoadingController, private nativeGeocoder: NativeGeocoder, private diagnostic: Diagnostic,
		private geolocation: Geolocation, private fcm: FCM, private platform: Platform,  private socket: Socket, 
    	private router: Router, private activateRoute: ActivatedRoute) {
		this.model.lets_text = '';
		this.model.lets_keyword_id = '';
		this.model.minutes = '';
		this.model.gender = 0;
		this.FrmCreateLets = this.form.group({
			TxtLets: [this.model.lets_text, Validators.compose([Validators.required])],
			TxtMinutes: [this.model.minutes, Validators.compose([Validators.required])],
			DdlGender: [this.model.gender, Validators.compose([Validators.required, Validators.min(1)])],
		});
		this.tempLetsID = this.activateRoute.snapshot.paramMap.get('tempLetsID'); 


    this.diagnostic.isLocationEnabled().then((isEnable:boolean)=>{
      if(!isEnable){
        this.promptEnableLocation();
      }
    }).catch((error)=>{
      console.log(error);
    });
    this.diagnostic.isLocationAuthorized().then((authorized)=>{
      this.diagnostic.requestLocationAuthorization(this.diagnostic.locationAuthorizationMode.ALWAYS).then((status)=>{
        switch(status){
          case this.diagnostic.permissionStatus.NOT_REQUESTED:
            console.log("Permission not requested");
              break;
          case this.diagnostic.permissionStatus.DENIED:
            this.toastCtrl.create({ message: "Enable location permission to create lets.", duration: 5000, position: 'top', cssClass: "custom-failure-class" }).then((toastData) => { toastData.present});
            break;
          case this.diagnostic.permissionStatus.DENIED_ALWAYS:
            this.toastCtrl.create({ message: "Enable location permission to create lets.", duration: 5000, position: 'top', cssClass: "custom-failure-class" }).then((toastData) => { toastData.present});
              break;
          case this.diagnostic.permissionStatus.GRANTED:
             console.log("Permission granted always");
             break;
          case this.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE:
             console.log("Permission granted only when in use (Android >= 10)");
             break;
      }
      });
    }).catch((err)=>{ console.log(err); });
		this.events.publish('loc_device_update', localStorage.getItem("il_user_id"));
		this.showLetsKeywords();
		this.setupFCM();
	}

	ionViewDidEnter() {
		if (this.tempLetsID > 0) {
			this.moveTempLetsToLetsRequest();
		} else {
			this.getRunningLets();
		}
    	this.getDeviceID();
		this.getLetsTags();
	}

  async promptEnableLocation(){
    const alert = await this.alertCtrl.create({
      header: 'Use Location',
      subHeader: 'App need location to be enabled to create lets.',
      buttons: [{
        text: 'Enable',
        role: 'cancel',
        handler: () => {
          this.diagnostic.switchToLocationSettings();
        }
      }]
    });
    await alert.present();
  }

	showLetsKeywords() {
		this.restrictedWordErr = false;
		this.keywordMsg = "Select keyword";
		if (this.model.lets_text != '') {
			this.http.post(
				SERVER_URL.baseURL + '/services/getLetsKeywords',
				{
					client_key: SERVER_URL.client_key,
					user_id: localStorage.getItem("il_user_id"),
					search_key: this.model.lets_text
				}, {
				headers: new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded')
			}).subscribe(data => {
				this.resultObj = data;
				if (this.resultObj.code == 200) {
					this.letsKeywords = this.resultObj.keywords;
				}
				else {
					this.letsKeywords = new Array();
				}
			},
				((err: HttpErrorResponse) => { })
			);
		} else {
			this.letsKeywords = new Array();
		}
	}

	selectKeyword(index) {
		this.model.lets_text = this.letsKeywords[Object.keys(this.letsKeywords)[index]].lets_keyword;
		this.model.lets_keyword_id = this.letsKeywords[Object.keys(this.letsKeywords)[index]].lets_keyword_id;
		this.letsKeywords = new Array();
		this.restrictedWordErr = false;
		this.keywordMsg = "Select keyword";
	}

	getLetsTags() {
		const body = {
			client_key: SERVER_URL.client_key,
			user_id: localStorage.getItem("il_user_id")
		};
		this.http.post(
			SERVER_URL.baseURL + '/services/getLetsTags',
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

	showProfile() {
    this.navCtrl.navigateForward('/profile');
	}

	showDiscover() {
    this.navCtrl.navigateForward('/discover');
	}

	async presentAlertConfirm() {

	}

	async onSubmit(value) {
		this.submitted = true;
		if (this.FrmCreateLets.valid) {
			const alert = await this.alertCtrl.create({
				header: 'Confirm',
				message: 'Are you in public place?',
				buttons: [{
					text: 'Send',
					cssClass: 'alert-success',
					handler: () => {
						this.saveLets();
					}
				}
				]
			});
			await alert.present();
		}
	}

	async saveLets() {
    let isEnable= await this.diagnostic.isLocationEnabled();
    if(!isEnable){
      this.toastCtrl.create({
        message: 'Enable location to create lets.', position: 'top', duration: 2700, cssClass: "custom-failure-class"
      }).then((toastData) => { toastData.present(); });
      return;
    }
    let authorized = await this.diagnostic.isLocationAuthorized();
    if(!authorized){
      this.toastCtrl.create({
        message: 'Allow App location permission to create lets.', position: 'top', duration: 2700, cssClass: "custom-failure-class"
      }).then((toastData) => { toastData.present(); });
      return;
    }
	const loading = this.loadingCtrl.create({
      message: 'Please wait...',
    });
    loading.then((loadingData) => {
      loadingData.present();
    });
		const body = {
			client_key: SERVER_URL.client_key,
			user_id: localStorage.getItem("il_user_id"),
			lets_text: this.model.lets_text,
			lets_keyword_id: this.model.lets_keyword_id,
			minutes: this.model.minutes,
			gender: this.model.gender
		};
		this.http.post(
			SERVER_URL.baseURL + '/services/saveLets',
			body, {
				headers: new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded')
			})
			.subscribe((data => {
				loading.then((loadingData) => { loadingData.dismiss(); });
				this.resultObj = data;
				if (this.resultObj.code == 200) {
					this.toastCtrl.create({
						message: this.resultObj.message, position: 'top', duration: 2700, cssClass: "custom-success-class"
					}).then((toastData) => { toastData.present(); });
					this.timeInSeconds = this.resultObj.lets_in_seconds;
					this.initTimer();
					this.startTimer();
					this.disableLetsForm();
					this.letsID=this.resultObj.lets_id;
					this.updateLetsLocDetails();
				} else if (this.resultObj.code == 501) {
						this.toastCtrl.create({
						message: this.resultObj.message, position: 'top', duration: 2700, cssClass: "custom-failure-class"
						}).then((toastData) => { toastData.present(); });
				} else if (this.resultObj.code == 502) {
					this.restrictedWordErr = true;
					this.keywordMsg = this.resultObj.message;
				} else if (this.resultObj.code == 503) {
					let alert = this.alertCtrl.create({
						header: 'Message',
						subHeader: this.resultObj.message,
						buttons: [{
							text: 'Cancel',
							cssClass: 'alert-fail-text',
							role: 'cancel',
							handler: () => { }
						},
						{
							text: 'Buy Lets',
							cssClass: 'alert-success',
							handler: () => { 
								this.saveTempLets(); 
							}
						}]
					}).then(res => {
						res.present();
					});
				} else if (this.resultObj.code == 504) {
					let alert = this.alertCtrl.create({
						header: 'Message',
						subHeader: this.resultObj.message,
						buttons: [{
							text: 'Cancel',
							cssClass: 'alert-fail-text',
							role: 'cancel',
							handler: () => { }
						},
						{
							text: 'Buy Lets',
							cssClass: 'alert-success',
							handler: () => { 
								this.saveTempLets(); 
							}
						}]
					}).then(res => {
						res.present();
					});
				} else if (this.resultObj.code == 505) {
					let alert = this.alertCtrl.create({
						header: 'Message',
						subHeader: this.resultObj.message,
						buttons: [{
							text: 'Ok',
							cssClass: 'alert-success',
							role: 'cancel',
							handler: () => {

							}
						}]
					}).then(res => {
						res.present();
					});
				}
				else {
					this.toastCtrl.create({
					message: this.resultObj.message, position: 'top', duration: 2700, cssClass: "custom-failure-class"
					}).then((toastData) => { toastData.present(); });
				}
			}),
			((err: HttpErrorResponse) => {
				loading.then((loadingData) => { loadingData.dismiss(); });
				this.toastCtrl.create({
					message: 'Please check your network connectivity and try logging in again..', position: 'top', duration: 2700, cssClass: "custom-failure-class"
				}).then((toastData) => { toastData.present(); });
			})
		);
	}

	saveTempLets() {
		this.http.post(
			SERVER_URL.baseURL + '/services/saveTempLets',
			{
				client_key: SERVER_URL.client_key,
				user_id: localStorage.getItem("il_user_id"),
				lets_text: this.model.lets_text,
				lets_keyword_id: this.model.lets_keyword_id,
				minutes: this.model.minutes,
				gender: this.model.gender
			}, {
			headers: new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded')
		}).subscribe(
				(data => {
					this.resultObj = data;
					if (this.resultObj.code == 200) {
            			this.navCtrl.navigateForward('/subscriptions/'+this.resultObj.temp_lets_id);
					} else {
						this.toastCtrl.create({
						message: 'Please check your network connectivity and try logging in again..', position: 'top', duration: 2700, cssClass: "custom-failure-class"
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

	moveTempLetsToLetsRequest() {
		this.http.post(
			SERVER_URL.baseURL + '/services/moveTempLetsToLetsRequest',
			{
				client_key: SERVER_URL.client_key,
				temp_lets_id: this.tempLetsID
			}, {
			headers: new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded')
		}).subscribe(
				(data => {
					this.resultObj = data;
					if (this.resultObj.code == 200) {
						this.timeInSeconds = this.resultObj.lets_in_seconds;
						this.initTimer();
						this.startTimer();
						this.disableLetsForm();
            this.letsID = this.resultObj.lets_id
						this.updateLetsLocDetails();
					} else {
						this.toastCtrl.create({
              message: 'Please check your network connectivity and try logging in again..', position: 'top', duration: 2700, cssClass: "custom-failure-class"
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

	updateLetsLocDetails() {
   
    // await this.platform.ready();
		this.geolocation.getCurrentPosition().then(resp => {
  
			this.currentLat = resp.coords.latitude;
			this.currentLang = resp.coords.longitude;
			let options: NativeGeocoderOptions = {
				useLocale: true,
				maxResults: 1
			};

			this.nativeGeocoder.reverseGeocode(parseFloat(this.currentLat), parseFloat(this.currentLang), {
				useLocale: true,
				maxResults: 1
			}).then((result: NativeGeocoderResult[]) => {
				this.currentAddress = result[0].subLocality + " " + result[0].locality + " " + result[0].postalCode;
				this.http.post(
					SERVER_URL.baseURL + '/services/updateLetsLocDetails',
					{
						client_key: SERVER_URL.client_key,
						user_id: localStorage.getItem("il_user_id"),
						lets_id: this.letsID,
						current_address: this.currentAddress,
						current_lat: this.currentLat,
						current_lng: this.currentLang
					}, {
					headers: new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded')
				}).subscribe(
					(data => {
						this.resultObj = data;
						this.totalAvailableUsers = this.resultObj.total_available_users;
            if(this.resultObj.code==201){
              this.navCtrl.navigateForward('/no-lets-user/'+this.resultObj.message);
            }
					}),
					((err: HttpErrorResponse) => {
            this.toastCtrl.create({
              message: 'Please check your network connectivity and try logging in again..', position: 'top', duration: 2700, cssClass: "custom-failure-class"
            }).then((toastData) => { toastData.present(); });
					})
				);
			}).catch((error: any) => {
        // this.updateLetsLocDetails();
        // console.log('Error getting location2', error);
      });
		}).catch(error => {
      // this.updateLetsLocDetails();
			//console.log('Error getting location', error);
		});
	}

	initTimer() {
		if (!this.timeInSeconds) {
			this.timeInSeconds = 1500;
		}
		this.runTimer = false;
		this.hasStarted = false;
		this.hasFinished = false;
		this.remainingTime = this.timeInSeconds;
		this.displayTime = this.getSecondsAsDigitalClock(this.remainingTime);
	}

	getSecondsAsDigitalClock(inputSeconds: number) {
		var sec_num = parseInt(inputSeconds.toString(), 10); // don't forget the second param
		var hours = Math.floor(sec_num / 3600);
		var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
		var seconds = sec_num - (hours * 3600) - (minutes * 60);
		var hoursString = '';
		var minutesString = '';
		var secondsString = '';
		hoursString = (hours < 10) ? "0" + hours : hours.toString();
		minutesString = (minutes < 10) ? "0" + minutes : minutes.toString();
		secondsString = (seconds < 10) ? "0" + seconds : seconds.toString();
		return hoursString + 'h: ' + minutesString + 'm: ' + secondsString + 's';
	}

	startTimer() {
		this.runTimer = true;
		this.hasStarted = true;
		this.timerTick();
	}

	timerTick() {
		setTimeout(() => {
			if (!this.runTimer) { return; }
			this.remainingTime--;
			this.displayTime = this.getSecondsAsDigitalClock(this.remainingTime);
			if (this.remainingTime > 0) {
				this.timerTick();
			}
			else {
				this.hasFinished = true;
				this.showLetsExpiredAlert();
			}
		}, 1000);
	}

	showLetsExpiredAlert() {
		const body = {
			client_key: SERVER_URL.client_key,
			user_id: localStorage.getItem("il_user_id")
		};
		this.http.post(
			SERVER_URL.baseURL + '/services/setLetsExpired',
			body, {
			headers: new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded')
		}).subscribe(
				(data => {
					this.resultObj = data;
					if (this.resultObj.code == 200) {
						let alert = this.alertCtrl.create({
							header: 'Lets Expired',
							subHeader: 'Your lets has been expired.',
							buttons: [{
								text: 'Ok',
								role: 'cancel',
								handler: () => {
									this.enableLetsForm();
								}
							}]
						}).then((res) => { res.present(); });
					} else {
            this.toastCtrl.create({
              message: 'Please check your network connectivity and try logging in again..', position: 'top', duration: 2700, cssClass: "custom-failure-class"
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

	enableLetsForm() {
		this.model.lets_text = '';
		this.model.lets_keyword_id = '';
		this.model.minutes = '';
		this.model.gender = 0;
		this.disableFormFlag = false;
		this.disableFlag = false;
		this.readOnlyFlag = false;
	}

	disableLetsForm() {
		this.disableFormFlag = true;
		this.disableFlag = true;
		this.readOnlyFlag = true;
	}

	pauseTimer() {
		this.runTimer = false;
	}

	resumeTimer() {
		this.startTimer();
	}

	getRunningLets() {
    const loading = this.loadingCtrl.create({
      message: 'Please wait...',
    });
    loading.then((loadingData) => {
      loadingData.present();
    });
		const body = {
			client_key: SERVER_URL.client_key,
			user_id: localStorage.getItem("il_user_id")
		};
		this.http.post(
			SERVER_URL.baseURL + '/services/getRunningLets',
			body, {
			headers: new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded')
		}).subscribe(
				(data => {
					loading.then((loadingData) => { loadingData.dismiss(); });
					this.resultObj = data;
					if (this.resultObj.code == 200) {
						this.model.lets_text = this.resultObj.lets_text;
						this.model.lets_keyword_id = this.resultObj.lets_keyword_id;
						this.model.minutes = this.resultObj.lets_duration;
						this.model.gender = this.resultObj.gender_id;
						this.timeInSeconds = this.resultObj.remaining_secs;
						if (parseInt(this.resultObj.user_id) == parseInt(localStorage.getItem("il_user_id"))) {
							if(this.resultObj.lets_status==3){
								this.navCtrl.navigateRoot('/active-lets/'+this.resultObj.lets_id);
							}
							else if(this.resultObj.accepted_user_flag==1){
								this.navCtrl.navigateRoot('/acepted-user/'+this.resultObj.lets_id+'/'+this.resultObj.accepted_user_id);
							} else{
								this.initTimer();
								this.startTimer();
								this.disableLetsForm();
							}
						}else{
							if(this.resultObj.lets_status==3){
								this.navCtrl.navigateRoot('/reciever-active-lets/'+this.resultObj.lets_id);
							} else if(this.resultObj.accepted_user_flag==1){
								this.navCtrl.navigateRoot('/accepted-waiting/'+this.resultObj.lets_id);
							}
						}
					}  else {
						this.enableLetsForm();
						this.pauseTimer();
					}
				}),
				((err: HttpErrorResponse) => {
					loading.then((loadingData) => { loadingData.dismiss(); });
					this.toastCtrl.create({
						message: 'Please check your network connectivity and try logging in again..', position: 'top', duration: 2700, cssClass: "custom-failure-class"
					}).then((toastData) => { toastData.present(); });
				})
			);
	}

	cancelLets() {
		const loading = this.loadingCtrl.create({
			message: 'Please wait...',
		});
		loading.then((loadingData) => {
			loadingData.present();
		});
		const body = {
			client_key: SERVER_URL.client_key,
      		lets_id: this.letsID,
			user_id: localStorage.getItem("il_user_id")
		};
		this.http.post(
			SERVER_URL.baseURL + '/services/cancelLets',
			body, {
			headers: new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded')
		}).subscribe((data => {
          			loading.then((loadingData) => { loadingData.dismiss(); });
					this.resultObj = data;
					if (this.resultObj.code == 200) {
						this.toastCtrl.create({
						message: this.resultObj.message, position: 'top', duration: 2700, cssClass: "custom-failure-class"
						}).then((toastData) => { toastData.present(); });
						this.enableLetsForm();
						this.pauseTimer();
						this.submitted = false;
						if(this.resultObj.partner_socket_id!=""){

						}
					} else {
						this.toastCtrl.create({
						message: this.resultObj.message, position: 'top', duration: 2700, cssClass: "custom-failure-class"
						}).then((toastData) => { toastData.present(); });
					}
				}),
				((err: HttpErrorResponse) => {
					loading.then((loadingData) => { loadingData.dismiss(); });
					this.toastCtrl.create({
						message: 'Please check your network connectivity and try logging in again..', position: 'top', duration: 2700, cssClass: "custom-failure-class"
					}).then((toastData) => { toastData.present(); });
				})
			);
	}

	checkLetsRequest() {
    const loading = this.loadingCtrl.create({
      message: 'Please wait...',
    });
    loading.then((loadingData) => {
      loadingData.present();
    });
		const body = {
			client_key: SERVER_URL.client_key,
			user_id: localStorage.getItem("il_user_id")
		};
		this.http.post(
			SERVER_URL.baseURL + '/services/checkLetsRequest',
			body, {
			headers: new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded')
		}).subscribe(
				(data => {
					loading.then((loadingData) => { loadingData.dismiss(); });
					this.resultObj = data;
					if (this.resultObj.code == 200) {
            this.navCtrl.navigateForward('/lets-request');
					} else {
						this.toastCtrl.create({
              message: 'No Lets request are available.', position: 'top', duration: 2700, cssClass: "custom-failure-class"
            }).then((toastData) => { toastData.present(); });
					}
				}),
				((err: HttpErrorResponse) => {
					loading.then((loadingData) => { loadingData.dismiss(); });
          this.toastCtrl.create({
            message: 'Please check your network connectivity and try logging in again..', position: 'top', duration: 2700, cssClass: "custom-failure-class"
          }).then((toastData) => { toastData.present(); });
				})
			);
	}

  getDeviceID = async () => {
    const info = await Device.getId();
    this.deviceID = info.uuid;
  };

	private async setupFCM() {
		await this.platform.ready();
		if (this.platform.is('ios')) {
			this.osPlatform = 2;
		}
		if (!this.platform.is('cordova')) {
			return;
		}
		//console.log("deviceID:" + this.deviceID);
		this.fcm.onTokenRefresh().subscribe((newToken) => {
			this.token = newToken;
			//console.log("fcm_refresh_token" + this.token);
			this.saveFCMTokenToServer();
		});

		this.fcm.onNotification().subscribe((payload) => {
		});

		this.token = await this.fcm.getToken();
		//console.log("fcm_token" + this.token);
		this.saveFCMTokenToServer();
	}

	saveFCMTokenToServer() {
		const body = {
			client_key: SERVER_URL.client_key,
			user_id: localStorage.getItem("il_user_id"),
			token: this.token,
			os_platform: this.osPlatform,
			device_id: this.deviceID
		};
		this.http.post(
			SERVER_URL.baseURL + '/services/saveFCMTokenToServer',
			body, {
			headers: new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded')
		}).subscribe(
				(data => {
					this.resultObj = data;
					if (this.resultObj.code === 200) {
					}
					else {
						console.log('Token save failed');
					}
				}),
				((err: HttpErrorResponse) => {
          // this.toastCtrl.create({
          //   message: 'Sorry!! something went wrong. Try again.', position: 'top', duration: 2700, cssClass: "custom-failure-class"
          // }).then((toastData) => { toastData.present(); });
				})
			);
	}

  goToHome() {
    this.navCtrl.navigateRoot('/home');
  }
}


