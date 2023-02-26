"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[4080],{4080:(z,S,r)=>{r.r(S),r.d(S,{ProfileGalleryPageModule:()=>H});var x=r(6895),O=r(433),l=r(8058),P=r(1407),f=r(655),u=r(4573),w=r(529),c=r(6388),B=r(7423),b=(()=>{return(i=b||(b={})).Documents="DOCUMENTS",i.Data="DATA",i.Library="LIBRARY",i.Cache="CACHE",i.External="EXTERNAL",i.ExternalStorage="EXTERNAL_STORAGE",b;var i})();const F=(0,B.fo)("Filesystem",{web:()=>r.e(6364).then(r.bind(r,6364)).then(i=>new i.FilesystemWeb)});var e=r(8274),U=r(5175),k=r(669);function Z(i,g){if(1&i&&e._UZ(0,"img",16),2&i){const t=e.oxw().$implicit;e.s9C("src",t.img_url,e.LSH)}}function R(i,g){if(1&i){const t=e.EpF();e.TgZ(0,"ion-col",11)(1,"div",12),e.NdJ("click",function(){const n=e.CHM(t),s=n.$implicit,a=n.index,m=e.oxw();return e.KtG(m.presentActionSheet(s.user_gallery_id,a+1))}),e.YNc(2,Z,1,1,"img",13),e.TgZ(3,"ion-fab",14)(4,"button",15),e._UZ(5,"ion-icon",7),e.qZA()()()()}if(2&i){const t=g.$implicit;e.xp6(2),e.Q6J("ngIf",""!=t.img_url)}}function Y(i,g){1&i&&(e.TgZ(0,"ion-row")(1,"ion-col",17)(2,"p",18),e._uU(3," Upload some selfie/photos to activate your account. "),e.qZA()()())}function L(i,g){if(1&i){const t=e.EpF();e.TgZ(0,"ion-button",19),e.NdJ("click",function(){e.CHM(t);const n=e.oxw();return e.KtG(n.goToHomePage())}),e._uU(1,"Continue"),e.qZA()}}const N=[{path:"",component:(()=>{class i{constructor(t,o,n,s,a,m,h,d,I,y,K){this.platform=t,this.navCtrl=o,this.plt=n,this.toastCtrl=s,this.actionSheetCtrl=a,this.http=m,this.loadingCtrl=h,this.activateRoute=d,this.router=I,this.transfer=y,this.imagePicker=K,this.model=Array(),this.profileImages=Array(),this.base64="",this.imgArr=[{user_gallery_id:0,img_ord:"1",img_name:"",img_url:""},{user_gallery_id:0,img_ord:"2",img_name:"",img_url:""},{user_gallery_id:0,img_ord:"3",img_name:"",img_url:""},{user_gallery_id:0,img_ord:"4",img_name:"",img_url:""}],this.profilePic="",this.hideContinueBtn=!0,this.editFlag=!1,this.convertBlobToBase64=G=>new Promise((A,_)=>{const p=new FileReader;p.onerror=_,p.onload=()=>{A(p.result)},p.readAsDataURL(G)}),this.b64toBlob=(G,A="",_=512)=>{const p=atob(G),E=[];for(let v=0;v<p.length;v+=_){const T=p.slice(v,v+_),M=new Array(T.length);for(let C=0;C<T.length;C++)M[C]=T.charCodeAt(C);const j=new Uint8Array(M);E.push(j)}return new Blob(E,{type:A})},this.flag=this.activateRoute.snapshot.paramMap.get("editFlag"),this.editFlag=1==this.flag,null==localStorage.getItem("il_profile_complete_flag")&&(1==parseInt(localStorage.getItem("il_profile_complete_flag"))||3==parseInt(localStorage.getItem("il_profile_complete_flag")))&&(this.hideContinueBtn=!0),this.profilePic=".../../assets/imgs/default_profile_pic.jpg",null!=localStorage.getItem("il_profile_pic")&&(this.profilePic=localStorage.getItem("il_profile_pic"))}ngOnInit(){}ionViewDidEnter(){this.getProfileGallery()}getProfileGallery(){this.http.post(u.L.baseURL+"/services/getProfileGallery",{client_key:u.L.client_key,user_id:localStorage.getItem("il_user_id")},{headers:(new w.WM).set("content-type","application/x-www-form-urlencoded")}).subscribe(t=>{if(this.resultObj=t,200==this.resultObj.code){this.profileImages=this.resultObj.images;for(var o=0;o<this.profileImages.length;o++){var n=parseInt(this.profileImages[o].img_ord);this.imgArr[n-1]=this.profileImages[o]}this.hideContinueBtn=!1}},t=>{})}presentActionSheet(t,o){return(0,f.mG)(this,void 0,void 0,function*(){(yield this.actionSheetCtrl.create({header:"Upload from",buttons:[{text:"Photo Gallery2",icon:"images",handler:()=>{this.openCamera(t,o)}},{text:"Camera",icon:"camera",handler:()=>{this.openCamera(t,o)}}]})).present()})}openCamera(t,o){t=parseInt(t),o=parseInt(o),c.V1.getPhoto({resultType:c.dk.Uri,source:c.oK.Camera,quality:90,allowEditing:!0,saveToGallery:!0,correctOrientation:!0}).then(s=>(0,f.mG)(this,void 0,void 0,function*(){console.log(s);var a=s.webPath;a.toString().substr(a.toString().lastIndexOf("/")+1);localStorage.getItem("il_user_id");const I=yield this.readAsBase64(s),y=o-1;this.imgArr[y]={user_gallery_id:y,img_name:y,img_ord:y,img_url:I}})).catch(s=>{this.toastCtrl.create({message:"Photo could not be uploaded",position:"top",duration:2700}).then(a=>{a.present()})})}openGallery(t,o){t=parseInt(t),o=parseInt(o),console.log({maximumImagesCount:1})}selectImage(){return(0,f.mG)(this,void 0,void 0,function*(){console.log("selectImage - Called");const t=yield c.V1.getPhoto({quality:90,allowEditing:!1,resultType:c.dk.Uri,source:c.oK.Photos});console.log(t),t&&this.saveImage(t)})}saveImage(t){return(0,f.mG)(this,void 0,void 0,function*(){const o=yield this.readAsBase64(t),n=(new Date).getTime()+".jpeg";return yield F.writeFile({path:n,data:o,directory:b.Data}),this.profilePic=o,{filepath:n,webviewPath:t.webPath}})}readAsBase64(t){return(0,f.mG)(this,void 0,void 0,function*(){if(this.platform.is("hybrid"))return(yield F.readFile({path:t.path})).data;{const n=yield(yield fetch(t.webPath)).blob();return yield this.convertBlobToBase64(n)}})}presentProfileActionSheet(){return(0,f.mG)(this,void 0,void 0,function*(){(yield this.actionSheetCtrl.create({header:"Upload from",buttons:[{text:"Photo Gallery1",icon:"images",handler:()=>{this.openProfileCamera()}},{text:"Camera",icon:"camera",handler:()=>{this.openProfileCamera()}}]})).present()})}openProfileGallery(){c.V1.getPhoto({source:c.oK.Photos,resultType:c.dk.DataUrl}).then(o=>{this.base64=o.dataUrl;var n=o.dataUrl;n.substr(n.lastIndexOf("/")+1);localStorage.getItem("il_user_id")}).catch(o=>{this.toastCtrl.create({message:"Sorry Images could not be loaded",position:"top",duration:2700}).then(n=>{n.present()})})}openProfileCamera(){return(0,f.mG)(this,void 0,void 0,function*(){var t={resultType:c.dk.Base64,source:c.oK.Camera,quality:90,allowEditing:!0,saveToGallery:!0,correctOrientation:!0};const o=yield c.V1.getPhoto(t);console.log("image",o);const n="sample-image",s={fileName:n,client_key:u.L.client_key,user_id:localStorage.getItem("il_user_id"),user_gallery_id:localStorage.getItem("il_user_id"),img_ord:"1234"},a=new FormData;for(const d in s)Object.prototype.hasOwnProperty.call(s,d)&&a.append(d,s[d]);const m=n+"."+o.format,h=this.b64toBlob(o.base64String,`image/${o.format}`);a.append("file",h,m),this.http.post(u.L.baseURL+"/services/uplProfileGalPic",a).subscribe(d=>{console.log("data",d)},d=>{console.log("error",d)})})}goToHomePage(){this.navCtrl.navigateForward("/home")}}return i.\u0275fac=function(t){return new(t||i)(e.Y36(l.t4),e.Y36(l.SH),e.Y36(l.t4),e.Y36(l.yF),e.Y36(l.BX),e.Y36(w.eN),e.Y36(l.HT),e.Y36(P.gz),e.Y36(P.F0),e.Y36(U.K),e.Y36(k.u))},i.\u0275cmp=e.Xpm({type:i,selectors:[["app-profile-gallery"]],decls:17,vars:4,consts:[[1,"transparent-navbar","white-text"],["slot","start"],[1,"dark-bg","white-text","ion-padding"],["size","12",2,"padding","0px"],[1,"upload-container"],[1,"upload-container-content",3,"click"],["alt","Default Pic",1,"upload-img",3,"src"],["name","add",1,"upload-add-icon"],["size","6",4,"ngFor","ngForOf"],[4,"ngIf"],["type","button","expand","full","class","btn-submit btn-continue",3,"click",4,"ngIf"],["size","6"],[1,"profile-img-holder",3,"click"],["class","profile-img",3,"src",4,"ngIf"],["bottom","","right",""],["ion-fab","","mini",""],[1,"profile-img",3,"src"],["col-12",""],[1,"msg-lighter","grey-text"],["type","button","expand","full",1,"btn-submit","btn-continue",3,"click"]],template:function(t,o){1&t&&(e.TgZ(0,"ion-header")(1,"ion-toolbar",0)(2,"ion-buttons",1),e._UZ(3,"ion-back-button"),e.qZA(),e.TgZ(4,"ion-title"),e._uU(5,"Profile Gallery"),e.qZA()()(),e.TgZ(6,"ion-content",2)(7,"ion-row")(8,"ion-col",3)(9,"div",4)(10,"div",5),e.NdJ("click",function(){return o.presentProfileActionSheet()}),e._UZ(11,"img",6)(12,"ion-icon",7),e.qZA()()()(),e.TgZ(13,"ion-row"),e.YNc(14,R,6,1,"ion-col",8),e.qZA(),e.YNc(15,Y,4,0,"ion-row",9),e.YNc(16,L,2,0,"ion-button",10),e.qZA()),2&t&&(e.xp6(11),e.s9C("src",o.profilePic,e.LSH),e.xp6(3),e.Q6J("ngForOf",o.imgArr),e.xp6(1),e.Q6J("ngIf",0==o.editFlag&&1==o.hideContinueBtn),e.xp6(1),e.Q6J("ngIf",0==o.editFlag&&0==o.hideContinueBtn))},dependencies:[x.sg,x.O5,l.oU,l.YG,l.Sm,l.wI,l.W2,l.IJ,l.Gu,l.gu,l.Nd,l.wd,l.sr,l.cs],styles:[".gallery-bg[_ngcontent-%COMP%]{background-color:#efefef}.upload-container[_ngcontent-%COMP%]{display:inline-block;width:100%;text-align:center;padding:56px 0 30px;background-color:#065efe}.upload-container-content[_ngcontent-%COMP%]{display:inline-block;width:150px;position:relative}.upload-img[_ngcontent-%COMP%]{width:150px;border-radius:50%;height:150px;border:solid 1px #B7B7B7}.upload-add-icon[_ngcontent-%COMP%]{position:absolute;bottom:9px;right:23px;font-size:1.5rem;height:2.5rem;width:2.5rem;color:#1089ff;background-color:#fff;padding:5px;border-radius:50%}.profile-img-holder[_ngcontent-%COMP%]{width:100%;height:222px;border:solid 2px #999;text-align:center;background-color:#eee;overflow:hidden}.profile-img[_ngcontent-%COMP%]{display:inline-block;width:100%}ion-fab[right][_ngcontent-%COMP%]{right:10px;right:calc(10px + constant(safe-area-inset-right));right:calc(2px + env(safe-area-inset-right))}ion-fab[bottom][_ngcontent-%COMP%]{bottom:2px}.fab-md[_ngcontent-%COMP%]{color:#fff;background-color:#1089ff}.btn-continue[_ngcontent-%COMP%]{margin-top:25px}"]}),i})()}];let J=(()=>{class i{}return i.\u0275fac=function(t){return new(t||i)},i.\u0275mod=e.oAB({type:i}),i.\u0275inj=e.cJS({imports:[P.Bz.forChild(N),P.Bz]}),i})(),H=(()=>{class i{}return i.\u0275fac=function(t){return new(t||i)},i.\u0275mod=e.oAB({type:i}),i.\u0275inj=e.cJS({imports:[x.ez,O.u5,l.Pc,J]}),i})()}}]);