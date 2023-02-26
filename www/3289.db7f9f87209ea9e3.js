"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[3289],{3289:(y,u,o)=>{o.r(u),o.d(u,{AceptedUserPageModule:()=>_});var g=o(6895),f=o(433),l=o(8058),h=o(1407),p=o(4573),d=o(529),c=o(2480),e=o(8274),m=o(5085);function b(s,r){if(1&s&&(e.TgZ(0,"span",26),e._uU(1),e.qZA()),2&s){const t=e.oxw(2);e.xp6(1),e.hij(", ",t.user_age,"")}}function x(s,r){if(1&s&&(e.TgZ(0,"div",19)(1,"div",20),e._UZ(2,"img",21),e.TgZ(3,"div",22)(4,"div",23),e._uU(5),e.YNc(6,b,2,1,"span",24),e.qZA(),e.TgZ(7,"div",25),e._uU(8),e.qZA()()()()),2&s){const t=r.$implicit,i=e.oxw();e.xp6(2),e.s9C("src",t.img_url,e.LSH),e.xp6(3),e.hij("",i.user_name," "),e.xp6(1),e.Q6J("ngIf",""!=i.user_age),e.xp6(2),e.Oqu(i.vaccination)}}c.tq.use([c.W_,c.tl,c.LW,c.lI,c.xW]);const w=[{path:"",component:(()=>{class s{constructor(t,i,n,a,C,P,O){this.navCtrl=t,this.activateRoute=i,this.http=n,this.platform=a,this.socket=C,this.alertCtrl=P,this.toastCtrl=O,this.model=new Array,this.map=null,this.letsID=this.activateRoute.snapshot.paramMap.get("letsID"),this.acceptedUserID=this.activateRoute.snapshot.paramMap.get("accpUserID")}ngAfterViewInit(){this.getLetsPartnerDetails()}getLetsPartnerDetails(){this.http.post(p.L.baseURL+"/services/getLetsPartnerDetails",{client_key:p.L.client_key,lets_id:this.letsID,accepted_user_id:this.acceptedUserID},{headers:(new d.WM).set("content-type","application/x-www-form-urlencoded")}).subscribe(t=>{this.resultObj=t,200==this.resultObj.code&&(this.user_name=this.resultObj.name,this.vaccination=this.resultObj.vaccination,this.user_age=this.resultObj.age,this.accepted_user_lat=this.resultObj.accepted_user_lat,this.accepted_user_lng=this.resultObj.accepted_user_lng,this.profile_pic=this.resultObj.profile_pic,this.galleryList=this.resultObj.gallery,this.loadAddrMap(),setTimeout(()=>{this.initializeGallery()},1500))},t=>{})}initializeGallery(){this.platform.ready().then(()=>{new c.tq(".swiper-container-inner",{touchStartForcePreventDefault:!0,speed:500,slidesPerView:1,spaceBetween:20,effect:"coverflow",coverflowEffect:{rotate:30,slideShadows:!1,depth:0},on:{slideChange:function(t){}}})})}cancelLets(){const t={client_key:p.L.client_key,user_id:localStorage.getItem("il_user_id")};this.http.post(p.L.baseURL+"/services/cancelLets",t,{headers:(new d.WM).set("content-type","application/x-www-form-urlencoded")}).subscribe(i=>{if(this.resultObj=i,200==this.resultObj.code){this.toastCtrl.create({message:this.resultObj.message,duration:3e3,position:"top",cssClass:"custom-success-class"}).then(a=>{a.present()});var n=this.resultObj.partner_socket_id;""!=n&&this.socket.emit("cancelpartner",{lets_id:this.letsID,socket_id:n}),this.navCtrl.navigateForward("/home")}else this.toastCtrl.create({message:this.resultObj.message,duration:3e3,position:"top",cssClass:"custom-failure-class"}).then(a=>{a.present()})},i=>{this.toastCtrl.create({message:"Please check your network connectivity and try logging in again..",duration:3e3,position:"top",cssClass:"custom-failure-class"}).then(n=>{n.present()})})}acceptLetsPartner(){this.navCtrl.navigateForward("/lets-selfi/"+this.letsID+"/"+this.acceptedUserID)}promptRejectLetsPartner(){this.alertCtrl.create({header:"Confirm",message:"Are you sure you want to reject?",buttons:[{text:"Yes",cssClass:"alert-success",handler:()=>{this.rejectLetsPartner()}},{text:"No",handler:()=>{}}]}).then(i=>{i.present()})}rejectLetsPartner(){const t={client_key:p.L.client_key,lets_id:this.letsID,user_id:localStorage.getItem("il_user_id"),accepted_user_id:this.acceptedUserID};this.http.post(p.L.baseURL+"/services/rejectLetsPartner",t,{headers:(new d.WM).set("content-type","application/x-www-form-urlencoded")}).subscribe(i=>{this.resultObj=i,200==this.resultObj.code?(this.toastCtrl.create({message:this.resultObj.message,duration:3e3,position:"top",cssClass:"custom-success-class"}).then(a=>{a.present()}),this.socket.emit("rejectpartner",{lets_id:this.letsID,socket_id:this.resultObj.partner_socket_id}),this.navCtrl.navigateForward("/home")):this.toastCtrl.create({message:this.resultObj.message,duration:3e3,position:"top",cssClass:"custom-failure-class"}).then(a=>{a.present()})},i=>{this.toastCtrl.create({message:"Please check your network connectivity and try logging in again..",duration:3e3,position:"top",cssClass:"custom-failure-class"}).then(n=>{n.present()})})}loadAddrMap(){const t=new google.maps.LatLng(this.accepted_user_lat,this.accepted_user_lng);this.map=new google.maps.Map(document.getElementById("add-map-holder"),{zoom:17,mapTypeControlOptions:{mapTypeIds:[]},fullscreenControl:!1,center:t,gestureHandling:"greedy",rotateControl:!0,streetViewControl:!1,zoomControl:!0,zoomControlOptions:{position:google.maps.ControlPosition.LEFT_BOTTOM}}),this.currmarker=new google.maps.Marker({position:t,title:"Current Location",draggable:!1}),this.currmarker.setMap(this.map)}}return s.\u0275fac=function(t){return new(t||s)(e.Y36(l.SH),e.Y36(h.gz),e.Y36(d.eN),e.Y36(l.t4),e.Y36(m.s),e.Y36(l.Br),e.Y36(l.yF))},s.\u0275cmp=e.Xpm({type:s,selectors:[["app-acepted-user"]],decls:22,vars:1,consts:[["padding","",1,"dark-bg"],[1,"page-heading","text-center","large-text"],[1,"swipper-holder"],[1,"swipper-holder-content"],[1,"swiper-container","swiper-container-inner"],[1,"swiper-wrapper"],["class","swiper-slide",4,"ngFor","ngForOf"],[1,"swiper-pagination"],[1,"swiper-button-prev","swiper-button-prev-inner"],[1,"swiper-button-next","swiper-button-next-inner"],[1,"page-heading"],[1,"live-location-holder"],["id","add-map-holder",1,"add-map-holder"],[1,"bottom-container"],["tappable","",1,"accept-link",3,"click"],["name","checkmark-circle"],["tappable","",1,"reject-link",3,"click"],["name","close-circle"],["tappable","",1,"cancel-lets-link",3,"click"],[1,"swiper-slide"],[1,"profiles-wrapper"],["alt","",1,"upload-img",3,"src"],[1,"profile-detail-holder"],[1,"profile-name-holder"],["class","profile-age-holder",4,"ngIf"],[1,"profile-vaccination"],[1,"profile-age-holder"]],template:function(t,i){1&t&&(e.TgZ(0,"ion-content",0)(1,"div",1),e._uU(2,"Activity partner"),e.qZA(),e.TgZ(3,"div",2)(4,"div",3)(5,"div",4)(6,"div",5),e.YNc(7,x,9,4,"div",6),e.qZA(),e._UZ(8,"div",7)(9,"div",8)(10,"div",9),e.qZA()()(),e.TgZ(11,"div",10),e._uU(12,"Activity partner location"),e.qZA(),e.TgZ(13,"div",11),e._UZ(14,"div",12),e.qZA()(),e.TgZ(15,"div",13)(16,"div",14),e.NdJ("click",function(){return i.acceptLetsPartner()}),e._UZ(17,"ion-icon",15),e.qZA(),e.TgZ(18,"div",16),e.NdJ("click",function(){return i.promptRejectLetsPartner()}),e._UZ(19,"ion-icon",17),e.qZA(),e.TgZ(20,"div",18),e.NdJ("click",function(){return i.cancelLets()}),e._uU(21," Cancel Lets"),e.qZA()()),2&t&&(e.xp6(7),e.Q6J("ngForOf",i.galleryList))},dependencies:[g.sg,g.O5,l.W2,l.gu],styles:[".profiles-wrapper[_ngcontent-%COMP%]{position:relative;display:inline-block;width:100%;height:100%;overflow:hidden}.profile-detail-holder[_ngcontent-%COMP%]{position:absolute;bottom:35px;left:20px}.profile-name-holder[_ngcontent-%COMP%]{color:#fff;font-size:23px;font-weight:800;text-align:left}.profile-vaccination[_ngcontent-%COMP%]{color:#fff;text-align:left;font-size:13px}.profile-age-holder[_ngcontent-%COMP%]{color:#fff;font-size:18px;font-weight:600;text-align:left}.swiper-container[_ngcontent-%COMP%]{height:75vh}.swiper-slide[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{height:100%}.swiper-button-prev-outer[_ngcontent-%COMP%], .swiper-button-next-outer[_ngcontent-%COMP%]{display:none}.swiper-button-prev-inner[_ngcontent-%COMP%], .swiper-button-next-inner[_ngcontent-%COMP%]{opacity:0;min-height:100%;min-width:50%;top:0px}.swiper-button-prev.swiper-button-disabled[_ngcontent-%COMP%], .swiper-button-next.swiper-button-disabled[_ngcontent-%COMP%]{opacity:0}.swiper-pagination-bullet[_ngcontent-%COMP%]{border-radius:4px;display:inline-block;width:18px;height:8px;background:#FFF;color:transparent;opacity:.5;pointer-events:auto}.swiper-pagination-bullet-active[_ngcontent-%COMP%]{background:#488aff;opacity:1}.swiper-pagination-fraction[_ngcontent-%COMP%], .swiper-pagination-custom[_ngcontent-%COMP%], .swiper-container-horizontal[_ngcontent-%COMP%] > .swiper-pagination-bullets[_ngcontent-%COMP%]{top:50px}.swipper-holder[_ngcontent-%COMP%]{float:left;width:100%}.swipper-holder-content[_ngcontent-%COMP%]{background-color:#f8f8f8;box-shadow:0 0 2px rgba(76,70,70,.75);-webkit-box-shadow:0px 0px 2px 0px rgba(76,70,70,.75);-moz-box-shadow:0px 0px 2px 0px rgba(76,70,70,.75);border-radius:15px;-webkit-border-radius:15px;-moz-border-radius:15px;margin-bottom:15px}.upload-img[_ngcontent-%COMP%]{border-radius:15px;-webkit-border-radius:15px;-moz-border-radius:15px;min-width:100%}.bottom-container[_ngcontent-%COMP%]{position:absolute;bottom:0px;left:0px;width:100%;padding-top:7px;padding-bottom:7px;z-index:1;background-color:#fff;box-shadow:0 -2px 2px rgba(152,152,152,.75);-webkit-box-shadow:0px -2px 2px 0px rgba(152,152,152,.75);-moz-box-shadow:0px -2px 2px 0px rgba(152,152,152,.75)}.reject-link[_ngcontent-%COMP%]{float:right;width:50%;color:#f53d3d;text-align:center;font-size:4rem}.accept-link[_ngcontent-%COMP%]{float:left;width:50%;color:#32db64;text-align:center;font-size:4rem}.cancel-lets-link[_ngcontent-%COMP%]{float:left;width:100%;text-align:center;color:red}.live-location-holder[_ngcontent-%COMP%]{display:inline-block;width:100%;margin-bottom:85px}.add-map-holder[_ngcontent-%COMP%]{float:left;width:100%;height:200px;margin-top:-5px;box-shadow:0 0 2px rgba(76,70,70,.75);-webkit-box-shadow:0px 0px 2px 0px rgba(76,70,70,.75);-moz-box-shadow:0px 0px 2px 0px rgba(76,70,70,.75);border-radius:3px}.page-heading[_ngcontent-%COMP%]{float:left;width:100%;margin-bottom:10px;color:#fff}.large-text[_ngcontent-%COMP%]{font-size:18px}"]}),s})()}];let v=(()=>{class s{}return s.\u0275fac=function(t){return new(t||s)},s.\u0275mod=e.oAB({type:s}),s.\u0275inj=e.cJS({imports:[h.Bz.forChild(w),h.Bz]}),s})(),_=(()=>{class s{}return s.\u0275fac=function(t){return new(t||s)},s.\u0275mod=e.oAB({type:s}),s.\u0275inj=e.cJS({imports:[g.ez,f.u5,l.Pc,v]}),s})()}}]);