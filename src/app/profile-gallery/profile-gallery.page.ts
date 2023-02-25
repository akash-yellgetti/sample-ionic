import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, ToastController, Platform, ActionSheetController } from '@ionic/angular';
import { SERVER_URL } from '../../config/config';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router} from '@angular/router';
import { Camera, CameraResultType, CameraSource, ImageOptions, Photo } from '@capacitor/camera';
import { FileTransfer, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
// import { File } from '@awesome-cordova-plugins/file';
import { ImagePicker, ImagePickerOptions } from '@awesome-cordova-plugins/image-picker/ngx';
import { decode } from "base64-arraybuffer";
import { Directory, Filesystem } from '@capacitor/filesystem';

const IMAGE_DIR = 'stored-images';

interface LocalFile {
  name: string;
  path: string;
  data: string;
}

@Component({
  selector: 'app-profile-gallery',
  templateUrl: './profile-gallery.page.html',
  styleUrls: ['./profile-gallery.page.scss'],
})
export class ProfileGalleryPage implements OnInit{
  model: any = Array();
  imgObj: any;
  resultObj: any;
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
  flag: any;
  constructor(private platform: Platform, public navCtrl: NavController, public plt: Platform, private toastCtrl: ToastController, private actionSheetCtrl: ActionSheetController,
    private http: HttpClient, private loadingCtrl: LoadingController, private activateRoute: ActivatedRoute, 
    private router: Router, private transfer: FileTransfer, private imagePicker: ImagePicker){ 
    this.flag = this.activateRoute.snapshot.paramMap.get('editFlag');
    if(this.flag==1){
      this.editFlag = true;
    }else{
      this.editFlag = false;
    }
   
    if (localStorage.getItem("il_profile_complete_flag") == null) {
        if ((parseInt(localStorage.getItem("il_profile_complete_flag")) == 1) || (parseInt(localStorage.getItem("il_profile_complete_flag")) == 3)) {
            this.hideContinueBtn = true;
        }
    }
    this.profilePic = '.../../assets/imgs/default_profile_pic.jpg';
    if (localStorage.getItem("il_profile_pic") != null) {
        this.profilePic = localStorage.getItem("il_profile_pic");
    }
}

ngOnInit(){
  //Camera.requestPermissions({permissions:['photos']});
}

ionViewDidEnter() {
  this.getProfileGallery();
}

getProfileGallery() {
    this.http.post(
        SERVER_URL.baseURL + '/services/getProfileGallery',
        {
            client_key: SERVER_URL.client_key,
            user_id: localStorage.getItem("il_user_id")
        }, {
        headers: new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded')
    }).subscribe(data => {
          this.resultObj = data;
          if (this.resultObj.code == 200) {
              this.profileImages = this.resultObj.images;
              for (var i = 0; i < this.profileImages.length; i++) {
                  var orderNum = parseInt(this.profileImages[i]["img_ord"]);
                  this.imgArr[orderNum - 1] = this.profileImages[i];
              }
              this.hideContinueBtn = false;
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
              text: 'Photo Gallery2',
              icon: 'images',
              handler: () => {
                this.openCamera(userGalleryID, orderNum);
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
  Camera.getPhoto(options).then(async (imageData) => {
    //FIlesystem to save photo
    console.log(imageData)
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
    const base64Data = await this.readAsBase64(imageData);
    const no = orderNum - 1;
    this.imgArr[no] = {
                  "user_gallery_id": no,
                  "img_name": no,
                  "img_ord": no,
                  "img_url": base64Data
              }

    // const formData = new FormData();
    // formData.append('journeyId', _.get(details, '_doc'));
    // formData.append('file', this.file);

      // this.http.post(SERVER_URL.baseURL + '/services/uplProfileGalPic', formData, )
    // const fileTransfer: FileTransferObject = this.transfer.create();
    // fileTransfer.upload(filePath, SERVER_URL.baseURL + '/services/uplProfileGalPic', options)
    // .then((data) => {
    //     this.imgObj = JSON.parse(data.response);
    //     if (this.imgObj.code == 200) {
    //         this.imgArr[orderNum - 1] = {
    //             "user_gallery_id": this.imgObj.user_gallery_id,
    //             "img_name": this.imgObj.image,
    //             "img_ord": this.imgObj.img_ord,
    //             "img_url": this.imgObj.img_url
    //         }
    //         localStorage.setItem("il_profile_complete_flag", "3");
    //         this.hideContinueBtn = false;
    //     } else {
    //         this.toastCtrl.create({
    //           message: this.resultObj.message, position: 'top', duration: 2700
    //         }).then((toastData) => { toastData.present(); });
    //     }
    // }, (err) => {
    //     this.toastCtrl.create({
    //       message: this.resultObj.message, position: 'top', duration: 2700
    //     }).then((toastData) => { toastData.present(); });
    // });
  }).catch((err) => {
    this.toastCtrl.create({
      message: 'Photo could not be uploaded', position: 'top', duration: 2700
    }).then((toastData) => { toastData.present(); });
  });
}

openGallery(userGalleryID, orderNum) {
  userGalleryID = parseInt(userGalleryID);
  orderNum = parseInt(orderNum);
  const options: ImagePickerOptions = { maximumImagesCount: 1 }
  console.log(options)
  // this.imagePicker.getPictures(options).then((results) => {
  //   if (results.length) {
  //     let loading = this.loadingCtrl.create({
  //       message: 'Uploading your photo..',
  //     });
  //     loading.then((loadingData) => {
  //       loadingData.present();
  //     });
  //     var imageURI = results[0];
  //     var filePath = imageURI;
  //     var filename = imageURI.substr(imageURI.lastIndexOf('/') + 1);
  //     var options = {
  //       fileKey: "file",
  //       fileName: filename,
  //       chunkedMode: false,
  //       params: {
  //         'fileName': filename,
  //         'client_key': SERVER_URL.client_key,
  //         'user_id': localStorage.getItem("il_user_id"),
  //         'img_ord': orderNum,
  //         'user_gallery_id': userGalleryID
  //       }
  //     };
  //     const fileTransfer: FileTransferObject = this.transfer.create();
  //         fileTransfer.upload(filePath, SERVER_URL.baseURL + '/services/uplProfileGalPic', options)
  //             .then((data) => {
  //               loading.then((loadingData) => { loadingData.dismiss(); });
  //                 this.imgObj = JSON.parse(data.response);
  //                 if (this.imgObj.code == 200) {
  //                     orderNum = parseInt(orderNum);
  //                     this.imgArr[orderNum - 1] = {
  //                         "user_gallery_id": this.imgObj.user_gallery_id,
  //                         "img_name": this.imgObj.image,
  //                         "img_ord": this.imgObj.img_ord,
  //                         "img_url": this.imgObj.img_url
  //                     }
  //                     localStorage.setItem("il_profile_complete_flag", "3");
  //                     this.hideContinueBtn = false;
  //                 } else {
  //                   this.toastCtrl.create({
  //                     message: this.imgObj.message, position: 'top', duration: 3000
  //                   }).then((toastData) => { toastData.present(); });
  //                 }
  //             }, (err) => {
  //               loading.then((loadingData) => { loadingData.dismiss(); });
  //               this.toastCtrl.create({
  //                 message: "Image not found", position: 'top', duration: 3000
  //               }).then((toastData) => { toastData.present(); });
  //             });
  //     }
  // }, (err) => {
  //   this.toastCtrl.create({
  //     message: "Something went wrong. Please try again..", position: 'top', duration: 3000
  //   }).then((toastData) => { toastData.present(); });
  // });
}

  async selectImage() {
    console.log('selectImage - Called')
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos
    });
    console.log(image);
    if (image) {
      this.saveImage(image);
    }
  }
  async saveImage(photo: Photo) {
    // Convert photo to base64 format, required by Filesystem API to save
    const base64Data = await this.readAsBase64(photo);

    // Write the file to the data directory
    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });

    // Use webPath to display the new image instead of base64 since it's
    // already loaded into memory

    this.profilePic = base64Data;
    return {
      filepath: fileName,
      webviewPath: photo.webPath
    };
  }

  
  
  private async readAsBase64(photo: Photo) {
    // "hybrid" will detect Cordova or Capacitor
    if (this.platform.is('hybrid')) {
      // Read the file into base64 format
      const file = await Filesystem.readFile({
        path: photo.path
      });
  
      return file.data;
    }
    else {
      // Fetch the photo, read as a blob, then convert to base64 format
      const response = await fetch(photo.webPath);
      const blob = await response.blob();
  
      return await this.convertBlobToBase64(blob) as string;
    }
  }

  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

async presentProfileActionSheet() {
  const actionSheet = await this.actionSheetCtrl.create({
    header: 'Upload from',
    buttons: [
        {
            text: 'Photo Gallery1',
            icon: 'images',
            handler: () => {
              this.openProfileCamera();
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

// openProfileGallery() {
//   const options: ImagePickerOptions = { maximumImagesCount: 1 }
//   console.log('hi')
//   this.imagePicker.getPictures(options).then((results) => {
//     if (results.length) {
//       let loading = this.loadingCtrl.create({
//         message: 'Uploading your photo..',
//       });
//       loading.then((loadingData) => {
//         loadingData.present();
//       });
//       var imageURI = results[0];
//       var filePath = imageURI;
//       var filename = imageURI.substr(imageURI.lastIndexOf('/') + 1);
//       var options = {
//         fileKey: "file",
//         fileName: filename,
//         chunkedMode: false,
//         params: {
//             'fileName': filename,
//             'client_key': SERVER_URL.client_key,
//             'user_id': localStorage.getItem("il_user_id")
//         }
//     };
//       const fileTransfer: FileTransferObject = this.transfer.create();
//           fileTransfer.upload(filePath, SERVER_URL.baseURL + '/services/updateProfilePic', options)
//               .then((data) => {
//                 loading.then((loadingData) => { loadingData.dismiss(); });
//                   this.imgObj = JSON.parse(data.response);
//                   if (this.imgObj.code == 200) {
//                     this.profilePic = this.imgObj.path;
//                     localStorage.setItem("il_profile_pic", this.profilePic);
//                     this.hideContinueBtn = false;
//                     localStorage.setItem("il_profile_complete_flag", "3");
//                   } else {
//                     this.toastCtrl.create({
//                       message: this.resultObj.message, position: 'top', duration: 2700
//                     }).then((toastData) => { toastData.present(); });
//                   }
//               }, (err) => {
//                 loading.then((loadingData) => { loadingData.dismiss(); });
//                 this.toastCtrl.create({
//                   message: this.resultObj.message, position: 'top', duration: 3000
//                 }).then((toastData) => { toastData.present(); });
//               });
//       }
//   }, (err) => {
//     this.toastCtrl.create({
//       message: "Sorry Images could not be loaded", position: 'top', duration: 3000
//     }).then((toastData) => { toastData.present(); });
//   });
// }

openProfileGallery() {
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
            'user_id': localStorage.getItem("il_user_id")
        }
    };
    // const fileTransfer: FileTransferObject = this.transfer.create();
    // fileTransfer.upload(filePath, SERVER_URL.baseURL + '/services/updateProfilePic', options)
    // .then((data) => {
    //     this.imgObj = JSON.parse(data.response);
    //     if (this.imgObj.code == 200) {
    //       this.profilePic = this.imgObj.path;
    //       localStorage.setItem("il_profile_pic", this.profilePic);
    //       this.hideContinueBtn = false;
    //       localStorage.setItem("il_profile_complete_flag", "3");
    //     } else {
    //       this.toastCtrl.create({
    //         message: this.resultObj.message, position: 'top', duration: 2700
    //       }).then((toastData) => { toastData.present(); });
    //     }
    // }, (err) => {
    //     this.toastCtrl.create({
    //       message: this.resultObj.message, position: 'top', duration: 2700
    //     }).then((toastData) => { toastData.present(); });
    // });

  }).catch((err) => {
    this.toastCtrl.create({
      message: "Sorry Images could not be loaded", position: 'top', duration: 2700
    }).then((toastData) => { toastData.present(); });
  });
}

async openProfileCamera() {
  var options:ImageOptions = {
    resultType: CameraResultType.Base64, // file-based data; provides best performance
    source: CameraSource.Camera, // automatically take a new photo with the camera
    quality: 90, // highest quality (0 to 100)
    allowEditing: true, // Resizes image
    saveToGallery: true,
    correctOrientation: true
  }
  const image = await Camera.getPhoto(options);
  console.log('image', image)
  
      const fileName = 'sample-image';
      const params = {
          'fileName': fileName,
          'client_key': SERVER_URL.client_key,
          'user_id': localStorage.getItem("il_user_id"),
          'user_gallery_id': localStorage.getItem("il_user_id"),
          'img_ord': '1234'
      }
      
      const formData = new FormData();
      for (const i in params) {
        if (Object.prototype.hasOwnProperty.call(params, i)) {
          // console.log(i, params[i])
          formData.append(i, params[i]);
        }
      }
      
      
      const name = fileName+'.'+image.format;
      // console.log(name);
      const blob = this.b64toBlob(image.base64String, `image/${image.format}`);
      // console.log(blob);
      formData.append('file', blob, name);
      this.http.post(
        SERVER_URL.baseURL + '/services/uplProfileGalPic',
        formData).subscribe((data) => { 

          console.log('data', data)
        }, error => {
          console.log('error', error)
        })
}  
  b64toBlob = (b64Data, contentType='', sliceSize=512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
  
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
  
    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }

  goToHomePage() {
    this.navCtrl.navigateForward('/home');
  }
}
