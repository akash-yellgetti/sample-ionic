import { Component } from '@angular/core';
import { NavController, ToastController, LoadingController } from '@ionic/angular';
import { SERVER_URL } from '../../config/config';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';
import { ActivatedRoute } from '@angular/router';
import { Events } from '../services/events';
import { Camera, CameraResultType, CameraSource, ImageOptions } from '@capacitor/camera';
import { FileTransfer, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { File } from '@awesome-cordova-plugins/file';

@Component({
  selector: 'app-lets-selfi',
  templateUrl: './lets-selfi.page.html',
  styleUrls: ['./lets-selfi.page.scss'],
})
export class LetsSelfiPage{
  model: any = new Array();
  imgObj: any;
  imgArr: any = [{
    "lets_selfi_id": 0,
    "img_ord": "1",
    "img_name": "",
    "img_url": ""
  }, {
    "lets_selfi_id": 0,
    "img_ord": "2",
    "img_name": "",
    "img_url": ""
  }, {
    "lets_selfi_id": 0,
    "img_ord": "3",
    "img_name": "",
    "img_url": ""
  }];
  disableFormFlag: boolean = false;
  resultObj: any;
  letsID:any;
  acceptedUserID:any;
  constructor(public navCtrl: NavController, public activateRoute: ActivatedRoute, private http: HttpClient, private toastCtrl: ToastController,
    private loadingCtrl: LoadingController, private transfer: FileTransfer, private socket: Socket) {
    this.letsID = this.activateRoute.snapshot.paramMap.get('letsID');
    this.acceptedUserID = this.activateRoute.snapshot.paramMap.get('accpUserID');
  }

  openSelfiCamera(letsSelfiID, orderNum) {
    // this.editFlag = false;
    letsSelfiID = parseInt(letsSelfiID);
    orderNum = parseInt(orderNum);
    const options: ImageOptions = {
      resultType: CameraResultType.Uri, // file-based data; provides best performance
      source: CameraSource.Camera, // automatically take a new photo with the camera
      quality: 90, // highest quality (0 to 100)
      allowEditing: true, // Resizes image
      saveToGallery: true,
      correctOrientation: true
    }
    Camera.getPhoto(options).then((imageData) => {
      let loading = this.loadingCtrl.create({
        message: 'Please wait...',
      });
      loading.then((loadingData) => {
        loadingData.present();
      });
      //FIlesystem to save photo
      const fileTransfer: FileTransferObject = this.transfer.create();
      var imageURI = imageData.webPath;
      var filePath = imageURI;
      var filename = imageURI.toString().substr(imageURI.toString().lastIndexOf('/') + 1);
      var options = {
          fileKey: "file",
          fileName: filename,
          chunkedMode: false,
          params: {
            'client_key': SERVER_URL.client_key,
            'user_id': localStorage.getItem("il_user_id"),
            "lets_id": this.letsID,
            "lets_selfi_id": letsSelfiID,
            'fileName': filename,
            'img_ord': orderNum
          }
      };
      fileTransfer.upload(filePath, SERVER_URL.baseURL + '/services/uploadLetsReqSelfi', options)
      .then((data) => {
        loading.then((loadingData) => { loadingData.dismiss(); });
          this.imgObj = JSON.parse(data.response);
          this.imgObj = JSON.parse(data.response);
          if (this.imgObj.code == 200) {
            this.imgArr[orderNum - 1] = {
              "lets_selfi_id": this.imgObj.lets_selfi_id,
              "img_name": this.imgObj.image,
              "img_ord": this.imgObj.img_ord,
              "img_url": this.imgObj.img_url
            }
            this.disableFormFlag = true;
          } else {
            this.toastCtrl.create({ message: this.imgObj.message, duration: 3000, position: 'top', cssClass: "custom-success-class" })
            .then((toastData) => { toastData.present(); });
          }
      }, (err) => {
          this.toastCtrl.create({
            message: this.resultObj.message, position: 'top', duration: 2700
          }).then((toastData) => { toastData.present(); });
      });
    }, (err) => {
        this.toastCtrl.create({ message: 'Something went wrong. Please try again..', duration: 3000, position: 'top', cssClass: "custom-failure-class" })
        .then((toastData) => { toastData.present(); });
    });
  }

  acceptLetsPartner() {
    const body = {
      client_key: SERVER_URL.client_key,
      lets_id: this.letsID,
      user_id: localStorage.getItem("il_user_id"),
      accepted_user_id: this.acceptedUserID
    };
    this.http.post(
      SERVER_URL.baseURL + '/services/acceptLetsPartner',
      body, {
      headers: new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded')
    }).subscribe(
        (data => {
          this.resultObj = data;
          if (this.resultObj.code == 200) {
            this.toastCtrl.create({ message: this.resultObj.message, duration: 3000, position: 'top', cssClass: "custom-success-class" })
            .then((toastData) => { toastData.present(); });
            var partnerSocketID = this.resultObj.partner_socket_id;
            this.socket.emit("acceptpartner", { lets_id: this.letsID, socket_id: partnerSocketID });
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
}
