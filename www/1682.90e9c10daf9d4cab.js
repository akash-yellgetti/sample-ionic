"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[1682],{1682:(Z,_,a)=>{a.r(_),a.d(_,{ForgotPasswordPageModule:()=>M});var c=a(6895),i=a(433),r=a(8058),p=a(1407),u=a(4573),h=a(529),o=a(8274),b=a(579);function f(e,s){if(1&e&&(o.TgZ(0,"ion-select-option",16),o._uU(1),o.qZA()),2&e){const t=o.oxw().$implicit;o.MGl("value","+",t.country_phone_code,""),o.xp6(1),o.AsE(" +",t.country_phone_code," ",t.country_name," ")}}function P(e,s){1&e&&o.YNc(0,f,2,3,"ion-select-option",15),2&e&&o.Q6J("ngIf",""!=s.$implicit.country_phone_code)}function y(e,s){if(1&e&&(o.TgZ(0,"span"),o._uU(1),o.qZA()),2&e){const t=o.oxw(2);o.xp6(1),o.Oqu(t.model.min_mobile)}}function F(e,s){if(1&e&&(o.TgZ(0,"span"),o._uU(1),o.qZA()),2&e){const t=o.oxw(2);o.xp6(1),o.AsE("",t.model.min_mobile," - ",t.model.max_mobile,"")}}function w(e,s){if(1&e&&(o.TgZ(0,"div",17),o._uU(1," Enter a valid mobile number("),o.YNc(2,y,2,1,"span",18),o.YNc(3,F,2,2,"span",18),o._uU(4," Digits)! "),o.qZA()),2&e){const t=o.oxw();o.xp6(2),o.Q6J("ngIf",t.model.min_mobile==t.model.max_mobile),o.xp6(1),o.Q6J("ngIf",t.model.min_mobile!=t.model.max_mobile)}}function x(e,s){1&e&&(o.TgZ(0,"div",17),o._uU(1,"Mobile number not registered with us!"),o.qZA())}const C=[{path:"",component:(()=>{class e{constructor(t,n,g,m,d,l,v,O){this.navCtrl=t,this.plt=n,this.toastCtrl=g,this.form=m,this.http=d,this.loadingCtrl=l,this.events=v,this.router=O,this.model=new Array,this.mobRegFlag=!1,this.submitted=!1,this.model.country_id="99",this.model.country_phone_code="+91",this.model.min_mobile=10,this.model.max_mobile=10,this.model.mobile="",this.countries=[{country_id:99,country_name:"India",country_phone_code:91,min_mobile:10,max_mobile:10}],this.FrmForgotOTP=this.form.group({DdlCountry:[this.model.country_phone_code],TxtLogMobile:[this.model.mobile,i.kI.compose([i.kI.required,i.kI.pattern("[0-9]{"+this.model.min_mobile+","+this.model.max_mobile+"}"),i.kI.minLength(this.model.min_mobile),i.kI.maxLength(this.model.max_mobile)])]})}ngAfterViewInit(){this.getCountries()}ionViewDidLoad(){console.log("ionViewDidLoad RegistrationPage")}getCountryVal(){for(var t in this.countries)"+"+this.countries[t].country_phone_code==this.model.country_phone_code&&(this.model.country_id=this.countries[t].country_id,this.model.min_mobile=this.countries[t].min_mobile,this.model.max_mobile=this.countries[t].max_mobile,this.FrmForgotOTP=this.form.group({DdlCountry:[this.model.country_phone_code],TxtLogMobile:[this.model.mobile,i.kI.compose([i.kI.required,i.kI.pattern("[0-9]{"+this.model.min_mobile+","+this.model.max_mobile+"}"),i.kI.minLength(this.model.min_mobile),i.kI.maxLength(this.model.max_mobile)])]}))}getCountries(){this.http.post(u.L.baseURL+"/services/getCountries",{client_key:u.L.client_key},{headers:(new h.WM).set("content-type","application/x-www-form-urlencoded")}).subscribe(t=>{this.resultObj=t,200==this.resultObj.code&&(this.countries=this.resultObj.result)},t=>{})}onSubmit(t){if(this.FrmForgotOTP.valid){let n=this.loadingCtrl.create({message:"Please wait..."});n.then(d=>{d.present()});let g=this.model.country_phone_code.substring(1,this.model.country_phone_code.length);this.mobRegFlag=!1,this.http.post(u.L.baseURL+"/services/checkForgotPassword",{client_key:u.L.client_key,mobile:this.model.mobile,country_phone_code:g,country_id:this.model.country_id},{headers:(new h.WM).set("content-type","application/x-www-form-urlencoded")}).subscribe(d=>{n.then(l=>{l.dismiss()}),this.resultObj=d,200==this.resultObj.code?this.router.navigate(["/reset-password",this.resultObj.user_id]):500==this.resultObj.code?(this.mobRegFlag=!0,this.toastCtrl.create({message:this.resultObj.message,position:"top",duration:2700}).then(l=>{l.present()})):this.toastCtrl.create({message:this.resultObj.message,position:"top",duration:2700}).then(l=>{l.present()})},d=>{n.then(l=>{l.dismiss()}),this.toastCtrl.create({message:this.resultObj.message,position:"top",duration:2700}).then(l=>{l.present()})})}}goToLogin(){this.navCtrl.navigateForward("/login")}}return e.\u0275fac=function(t){return new(t||e)(o.Y36(r.SH),o.Y36(r.t4),o.Y36(r.yF),o.Y36(i.qu),o.Y36(h.eN),o.Y36(r.HT),o.Y36(b.z),o.Y36(p.F0))},e.\u0275cmp=o.Xpm({type:e,selectors:[["app-forgot-password"]],decls:22,vars:7,consts:[[1,"dark-bg","white-text","ion-padding"],[1,"logo-holder"],["src","../../assets/imgs/logo.png","alt","Logo",1,"logo-img"],[1,"h1-header"],[1,"msg-lighter","grey-text","mobile-reg-desc"],[1,"full-content","login-form-wrapper"],[1,"ion-text-center",3,"formGroup","ngSubmit"],[1,"form-list","login-form-list"],[1,"form-input-holder","mobile-input-holder"],["interface","action-sheet","name","DdlCountry","id","DdlCountry","formControlName","DdlCountry",1,"mobile-select",3,"ngModel","selectedText","ngModelChange","ionChange"],["ngFor","",3,"ngForOf"],["type","number","formControlName","TxtLogMobile","name","TxtLogMobile","id","TxtLogMobile","value","","required","","autocomplete","off","placeholder","Mobile*",1,"mobile-input",3,"ngModel","ngModelChange","keyup"],["class","err-msg",4,"ngIf"],["type","submit","expand","full",1,"btn-submit",3,"click"],["tappable","",1,"msg-lighter","grey-text","login-text",3,"click"],[3,"value",4,"ngIf"],[3,"value"],[1,"err-msg"],[4,"ngIf"]],template:function(t,n){1&t&&(o.TgZ(0,"ion-content",0)(1,"div",1),o._UZ(2,"img",2),o.qZA(),o.TgZ(3,"p",3),o._uU(4," Forgot Password "),o.qZA(),o.TgZ(5,"p",4),o._uU(6," Enter your mobile number to update your password. "),o.qZA(),o.TgZ(7,"div",5)(8,"form",6),o.NdJ("ngSubmit",function(){return n.onSubmit(n.FrmForgotOTP.value)}),o.TgZ(9,"ion-list",7)(10,"ion-item",8)(11,"ion-select",9),o.NdJ("ngModelChange",function(m){return n.model.country_phone_code=m})("ionChange",function(){return n.getCountryVal()}),o.YNc(12,P,1,1,"ng-template",10),o.qZA(),o.TgZ(13,"ion-input",11),o.NdJ("ngModelChange",function(m){return n.model.mobile=m})("keyup",function(){return n.mobRegFlag=!1}),o.qZA()(),o.YNc(14,w,5,2,"div",12),o.YNc(15,x,2,0,"div",12),o.qZA(),o.TgZ(16,"ion-button",13),o.NdJ("click",function(){return n.submitted=!0}),o._uU(17,"Continue"),o.qZA()()(),o.TgZ(18,"p",14),o.NdJ("click",function(){return n.goToLogin()}),o._uU(19," Already registered. "),o.TgZ(20,"strong"),o._uU(21,"Login here"),o.qZA()()()),2&t&&(o.xp6(8),o.Q6J("formGroup",n.FrmForgotOTP),o.xp6(3),o.Q6J("ngModel",n.model.country_phone_code)("selectedText",n.model.country_phone_code),o.xp6(1),o.Q6J("ngForOf",n.countries),o.xp6(1),o.Q6J("ngModel",n.model.mobile),o.xp6(1),o.Q6J("ngIf",(n.FrmForgotOTP.controls.TxtLogMobile.hasError("required")||n.FrmForgotOTP.controls.TxtLogMobile.hasError("pattern"))&&n.submitted),o.xp6(1),o.Q6J("ngIf",n.mobRegFlag&&n.submitted))},dependencies:[c.sg,c.O5,i._Y,i.JJ,i.JL,i.Q7,r.YG,r.W2,r.pK,r.Ie,r.q_,r.t9,r.n0,r.as,r.QI,i.sg,i.u],styles:[".login-form-list[_ngcontent-%COMP%]   .form-input-holder[_ngcontent-%COMP%]   .item-inner[_ngcontent-%COMP%]{margin-left:0}.logo-holder[_ngcontent-%COMP%]{display:inline-block;width:100%;margin-top:10px;text-align:center}.logo-img[_ngcontent-%COMP%]{display:inline-block;width:135px}.h1-header[_ngcontent-%COMP%]{font-size:1.6rem;margin-bottom:10px}.login-text[_ngcontent-%COMP%]{width:100%;display:inline-block;margin-top:10px;text-align:right}.login-text[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%]{color:#065efe}.mobile-select[_ngcontent-%COMP%]{font-size:1.4rem;color:#222;padding:8px;margin-top:1px}.mobile-select.select-md[_ngcontent-%COMP%]{padding:13px 8px 13px 25px}.mobile-input-holder[_ngcontent-%COMP%]{background:#ffffff!important;--background:#ffffff;color:#222;margin-bottom:10px}.mobile-input[_ngcontent-%COMP%]{border-bottom:0}"]}),e})()}];let T=(()=>{class e{}return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=o.oAB({type:e}),e.\u0275inj=o.cJS({imports:[p.Bz.forChild(C),p.Bz]}),e})(),M=(()=>{class e{}return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=o.oAB({type:e}),e.\u0275inj=o.cJS({imports:[c.ez,i.u5,r.Pc,T,i.UX]}),e})()}}]);