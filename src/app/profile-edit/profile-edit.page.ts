import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController, ActionSheetController } from '@ionic/angular';
import { SERVER_URL } from '../../config/config';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router} from '@angular/router';
import { Camera, CameraResultType, CameraSource, ImageOptions } from '@capacitor/camera';
import { FileTransfer, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { File } from '@awesome-cordova-plugins/file';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// import { Plugins } from "@capacitor/core";
// import { DatePickerPluginInterface } from '@capacitor-community/date-picker';
// const DatePicker: DatePickerPluginInterface = Plugins.DatePickerPlugin as any;
@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.page.html',
  styleUrls: ['./profile-edit.page.scss'],
})
export class ProfileEditPage {
    toDay: any;
    model: any = Array();
    imgObj: any;
    resultObj: any;
    flag: any;
    profileImages: any = Array();
    base64: string = "";
    imgArr: any = [{
        "user_gallery_id": 0,
        "img_ord": "1",
        "img_name": "",
        "img_url": ""
    }, {
        "user_gallery_id": 0,
        "img_ord": "2",
        "img_name": "",
        "img_url": ""
    }, {
        "user_gallery_id": 0,
        "img_ord": "3",
        "img_name": "",
        "img_url": ""
    }, {
        "user_gallery_id": 0,
        "img_ord": "4",
        "img_name": "",
        "img_url": ""
    }];
    profilePic: string = '';
    hideContinueBtn: boolean = true;
    editFlag: boolean = false;
    public FrmRegProfile: FormGroup;
    dupEmailFlag: boolean = false;
    submitted = false;
    letsTagList: any;
    genderErr = false;
    petErr: boolean = false;
    constructor(public navCtrl: NavController, private form: FormBuilder, 
      private http: HttpClient, private toastCtrl: ToastController, 
      private actionSheetCtrl: ActionSheetController, private loadingCtrl: LoadingController, 
      private transfer: FileTransfer, private activateRoute: ActivatedRoute, private router: Router) {
        this.flag = this.activateRoute.snapshot.paramMap.get('editFlag');  
        if(this.flag==1){
          this.editFlag = true;
        }else{
          this.editFlag = false;
        }
       
        this.profilePic = '.../../assets/imgs/default_profile_pic.jpg';
        if (localStorage.getItem("il_profile_pic") != null) {
            this.profilePic = localStorage.getItem("il_profile_pic");
        }
        this.model.name = '';
        this.model.email = '';
        this.model.gender = '';
        this.model.mstatus = '';
        this.model.dob = '';
        this.model.pet = 0;
        this.model.pet_name = '';
        if(this.model.pet!=3){
            this.petErr=false;
        }
        this.FrmRegProfile = this.form.group({
            TxtName: [this.model.name, Validators.compose([Validators.required])],
            TxtEmail: [this.model.email, Validators.compose([Validators.required, Validators.email])],
            TxtDOB: [this.model.dob],
            DdlGender: [this.model.gender, Validators.compose([Validators.required])],
            DdlVaccination: [this.model.vaccination, Validators.compose([Validators.required])],
            DdlMaritalStatus: [this.model.mstatus, Validators.compose([Validators.required])],
            DdlPet: [this.model.pet, Validators.compose([Validators.required])],
            TxtPetType: [this.model.pet_name, Validators.compose([Validators.required])],
        });
    }

    ionViewDidEnter() {
      this.toDay=new Date().toISOString();
      this.getGenders();
      this.getProfileGallery();
      this.getUserProfileDetails();
    }

    getProfileGallery() {
        this.http.post(
            SERVER_URL.baseURL + '/services/getProfileGallery',
            {
                client_key: SERVER_URL.client_key,
                user_id: localStorage.getItem("il_user_id")
            }, {
            headers: new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded')
        })
            .subscribe(data => {
                this.resultObj = data;
                if (this.resultObj.code == 200) {
                    this.profileImages = this.resultObj.images;
                    for (var i = 0; i < this.profileImages.length; i++) {
                        var orderNum = parseInt(this.profileImages[i]["img_ord"]);
                        this.imgArr[orderNum - 1] = this.profileImages[i];
                    }
                }
            },
                ((err: HttpErrorResponse) => { })
            );
    }

    getUserProfileDetails() {
        this.http.post(
            SERVER_URL.baseURL + '/services/getUserProfileDetails',
            {
                client_key: SERVER_URL.client_key,
                user_id: localStorage.getItem("il_user_id")
            }, {
            headers: new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded')
        })
            .subscribe(data => {
                this.resultObj = data;
                if (this.resultObj.code == 200) {
                    this.model.name = this.resultObj.name;
                    this.model.email = this.resultObj.email;
                    this.model.dob = this.resultObj.dob;
                    this.model.gender = this.resultObj.gender_id;
                    this.model.mstatus = this.resultObj.marital_status;
                    this.model.vaccination = this.resultObj.vaccination_status;
                    this.model.pet = this.resultObj.pet_type;
                    this.model.pet_name = this.resultObj.pet_type_text;
                }
            },
                ((err: HttpErrorResponse) => { })
            );
    }

    async presentActionSheet(userGalleryID, orderNum) {
        const actionSheet = await this.actionSheetCtrl.create({
        header: 'Upload from',
        buttons: [
            {
                text: 'Photo Gallery',
                icon: 'images',
                handler: () => {
                    this.openGallery(userGalleryID, orderNum);
                }
            },
            {
                text: 'Camera',
                icon: 'camera',
                handler: () => {
                    this.openCamera(userGalleryID, orderNum);
                }
            }
        ]
      });
      actionSheet.present();
    }


  openCamera(userGalleryID, orderNum) {
      userGalleryID = parseInt(userGalleryID);
      orderNum = parseInt(orderNum);
      var options:ImageOptions = {
        resultType: CameraResultType.Uri, // file-based data; provides best performance
        source: CameraSource.Camera, // automatically take a new photo with the camera
        quality: 90, // highest quality (0 to 100)
        allowEditing: true, // Resizes image
        saveToGallery: true,
        correctOrientation: true
      }
      Camera.getPhoto(options).then((imageData) => {
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
                'fileName': filename,
                'client_key': SERVER_URL.client_key,
                'user_id': localStorage.getItem("il_user_id"),
                'img_ord': orderNum,
                'user_gallery_id': userGalleryID
            }
        };
        fileTransfer.upload(filePath, SERVER_URL.baseURL + '/services/uplProfileGalPic', options)
        .then((data) => {
            this.imgObj = JSON.parse(data.response);
            if (this.imgObj.code == 200) {
                this.imgArr[orderNum - 1] = {
                    "user_gallery_id": this.imgObj.user_gallery_id,
                    "img_name": this.imgObj.image,
                    "img_ord": this.imgObj.img_ord,
                    "img_url": this.imgObj.img_url
                }
                localStorage.setItem("il_profile_complete_flag", "3");
                this.hideContinueBtn = false;
            } else {
                this.toastCtrl.create({
                  message: this.resultObj.message, position: 'top', duration: 2700
                }).then((toastData) => { toastData.present(); });
            }
        }, (err) => {
            this.toastCtrl.create({
              message: this.resultObj.message, position: 'top', duration: 2700
            }).then((toastData) => { toastData.present(); });
        });
      }).catch((err) => {
        this.toastCtrl.create({
          message: 'Photo could not be uploaded', position: 'top', duration: 2700
        }).then((toastData) => { toastData.present(); });
      });
  }

  openGallery(userGalleryID, orderNum) {
      userGalleryID = parseInt(userGalleryID);
      orderNum = parseInt(orderNum);

      var options:ImageOptions = {
        source: CameraSource.Photos,
        resultType: CameraResultType.DataUrl
      }

      Camera.getPhoto(options).then((imageData) => {
        this.base64 = imageData.dataUrl;
        var imageURI = imageData.dataUrl;
        var filePath = imageURI;
        var filename = imageURI.substr(imageURI.lastIndexOf('/') + 1);
        var options = {
            fileKey: "file",
            fileName: filename,
            chunkedMode: false,
            params: {
                'fileName': filename,
                'client_key': SERVER_URL.client_key,
                'user_id': localStorage.getItem("il_user_id"),
                'img_ord': orderNum,
                'user_gallery_id': userGalleryID
            }
        };
        const fileTransfer: FileTransferObject = this.transfer.create();
        fileTransfer.upload(filePath, SERVER_URL.baseURL + '/services/uplProfileGalPic', options)
        .then((data) => {
            this.imgObj = JSON.parse(data.response);
            if (this.imgObj.code == 200) {
                this.imgArr[orderNum - 1] = {
                    "user_gallery_id": this.imgObj.user_gallery_id,
                    "img_name": this.imgObj.image,
                    "img_ord": this.imgObj.img_ord,
                    "img_url": this.imgObj.img_url
                }
                localStorage.setItem("il_profile_complete_flag", "3");
                this.hideContinueBtn = false;
            } else {
                this.toastCtrl.create({
                  message: this.resultObj.message, position: 'top', duration: 2700
                }).then((toastData) => { toastData.present(); });
            }
        }, (err) => {
            this.toastCtrl.create({
              message: this.resultObj.message, position: 'top', duration: 2700
            }).then((toastData) => { toastData.present(); });
        });


      }).catch((err) => {
        this.toastCtrl.create({
          message: "Sorry Images could not be loaded", position: 'top', duration: 2700
        }).then((toastData) => { toastData.present(); });
      });
  }


  goToHomePage() {
    this.navCtrl.navigateForward('/home');
  }

  async presentProfileActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Upload from',
      buttons: [
          {
              text: 'Photo Gallery',
              icon: 'images',
              handler: () => {
                  this.openProfileGallery();
              }
          },
          {
              text: 'Camera',
              icon: 'camera',
              handler: () => {
                this.openProfileCamera();
              }
          }
      ]
    });
    actionSheet.present();
  }

  async openProfileGallery() {
    var options:ImageOptions = {
      source: CameraSource.Photos,
      resultType: CameraResultType.Uri
    }
   await Camera.getPhoto(options).then((imageData) => {
      this.base64 = imageData.dataUrl;
      var imageURI = imageData.dataUrl;
      // var filePath = imageURI;
      // var filename = imageURI.substr(imageURI.lastIndexOf('/') + 1);
      var filePath = imageData.webPath;
      var filename = filePath.toString().substr(filePath.toString().lastIndexOf('/') + 1);
      var options = {
          fileKey: "file",
          fileName: filename,
          chunkedMode: false,
          params: {
              'fileName': filename,
              'client_key': SERVER_URL.client_key,
              'user_id': localStorage.getItem("il_user_id")
          }
      };
      const fileTransfer: FileTransferObject = this.transfer.create();
      fileTransfer.upload(filePath, SERVER_URL.baseURL + '/services/updateProfilePic', options)
      .then((data) => {
          this.imgObj = JSON.parse(data.response);
          if (this.imgObj.code == 200) {
            this.profilePic = this.imgObj.path;
            localStorage.setItem("il_profile_pic", this.profilePic);
            this.hideContinueBtn = false;
            localStorage.setItem("il_profile_complete_flag", "3");
          } else {
            this.toastCtrl.create({
              message: this.resultObj.message, position: 'top', duration: 2700
            }).then((toastData) => { toastData.present(); });
          }
      }, (err) => {
          this.toastCtrl.create({
            message: this.resultObj.message, position: 'top', duration: 2700
          }).then((toastData) => { toastData.present(); });
      });
  
    }).catch((err) => {
      this.toastCtrl.create({
        message: "Sorry Images could not be loaded", position: 'top', duration: 2700
      }).then((toastData) => { toastData.present(); });
    });
  }
  
  async openProfileCamera() {
    var options:ImageOptions = {
      resultType: CameraResultType.Uri, // file-based data; provides best performance
      source: CameraSource.Camera, // automatically take a new photo with the camera
      quality: 90, // highest quality (0 to 100)
      allowEditing: true, // Resizes image
      saveToGallery: true,
      correctOrientation: true
    }
    await Camera.getPhoto(options).then((imageData) => {
      //FIlesystem to save photo
      const fileTransfer: FileTransferObject = this.transfer.create();
      var filePath = imageData.webPath;
      var filename = filePath.toString().substr(filePath.toString().lastIndexOf('/') + 1);
      var options = {
          fileKey: "file",
          fileName: filename,
          chunkedMode: false,
          params: {
              'fileName': filename,
              'client_key': SERVER_URL.client_key,
              'user_id': localStorage.getItem("il_user_id")
          }
      };
      
      fileTransfer.upload(filePath, SERVER_URL.baseURL + '/services/updateProfilePic', options)
      .then((data) => {
          console.log(data);
          this.imgObj = JSON.parse(data.response);
          if (this.imgObj.code == 200) {
            this.profilePic = this.imgObj.path;
            localStorage.setItem("il_profile_pic", this.profilePic);
            this.hideContinueBtn = false;
            localStorage.setItem("il_profile_complete_flag", "3");
          } else {
              this.toastCtrl.create({
                message: this.resultObj.message, position: 'top', duration: 2700
              }).then((toastData) => { toastData.present(); });
          }
      }, (err) => {
          this.toastCtrl.create({
            message: this.resultObj.message, position: 'top', duration: 2700
          }).then((toastData) => { toastData.present(); });
      });
    }).catch((err) => {
      this.toastCtrl.create({
        message: 'Photo could not be taken', position: 'top', duration: 2700
      }).then((toastData) => { toastData.present(); });
    });
  }
  
  /**
   * function to save the user profile
   */
  onSubmit() {
    this.genderErr = false;
    this.submitted=true;
    this.dupEmailFlag = false;
    if(parseInt(this.model.gender)==0){
      this.genderErr = true;
      return
    }
    if(this.model.pet==3 && this.model.pet_name==''){
      this.petErr=true;
      return;
    }else if(this.model.pet!=3){
      this.model.pet_name="";
    }
    this.http.post(
        SERVER_URL.baseURL + '/services/saveUserProfile',
        {
            client_key: SERVER_URL.client_key,
            user_id: localStorage.getItem("il_user_id"),
            name: this.model.name,
            email: this.model.email,
            dob: this.model.dob,
            gender_id: this.model.gender,
            vaccination_status: this.model.vaccination,
            pet: this.model.pet,
            pet_name: this.model.pet_name,
            marital_status: this.model.mstatus
        }, {
        headers: new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded')
    }).subscribe(data => {
            this.resultObj = data;
            if (this.resultObj.code == 200) {
                this.toastCtrl.create({
                  message: this.resultObj.message, position: 'top', duration: 2700, cssClass: "custom-success-class" 
                }).then((toastData) => { toastData.present(); });


            } else if (this.resultObj.code == 502) {
                this.dupEmailFlag = true;
            } else {
                this.toastCtrl.create({
                  message: "Something went wrong. Please try again..", position: 'top', duration: 2700, cssClass: "custom-success-class" 
                }).then((toastData) => { toastData.present(); });
            }
        },
            ((err: HttpErrorResponse) => { })
      );
  }
  
  getGenders() {
    const body = {
      client_key: SERVER_URL.client_key,
      user_id: localStorage.getItem("il_user_id")
    };
    this.http.post(
      SERVER_URL.baseURL + '/services/getGenders',
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
}
