"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[1346],{1346:(M,P,i)=>{i.r(P),i.d(P,{PackagesPageModule:()=>C});var f=i(6895),_=i(433),r=i(8058),b=i(1407),x=i(655),a=i(4573),g=i(529),v=(i(3120),i(7423)),t=i(8274);function p(s,d){if(1&s){const e=t.EpF();t.TgZ(0,"div",12)(1,"div",13),t._uU(2),t.qZA(),t.TgZ(3,"div",14),t._uU(4,"Month(s)"),t.qZA(),t.TgZ(5,"div",15),t._uU(6),t.TgZ(7,"span"),t._uU(8),t.qZA()(),t.TgZ(9,"div",16),t.NdJ("click",function(){const c=t.CHM(e).$implicit,u=t.oxw();return t.KtG(u.buySubscription(c))}),t._uU(10,"Buy"),t.qZA()()}if(2&s){const e=d.$implicit;t.xp6(2),t.Oqu(e.validiity_months),t.xp6(4),t.hij("Rs. ",e.discount_price," "),t.xp6(2),t.hij("Rs ",e.plan_price,"")}}const{Checkout:y}=v.Vn,h=[{path:"",component:(()=>{class s{constructor(e,n,o,c,u,m,w){this.navCtrl=e,this.http=n,this.toastCtrl=o,this.platform=c,this.loadingCtrl=u,this.router=m,this.activateRoute=w,this.plans=new Array,this.tempSubscriptionID=0,this.PGKey="",this.razorpayPaymentID="",this.razorpayOrderID="",this.paymentAmt=0,this.capPerDay=0,this.tempLetsID=this.activateRoute.snapshot.paramMap.get("tempLetsID"),this.getSubscriptionPlans(),this.getPGKeys()}ionViewDidLoad(){}getSubscriptionPlans(){let e=this.loadingCtrl.create({message:"Please wait..."});e.then(n=>{n.present()}),this.http.post(a.L.baseURL+"/services/getSubscriptionPlans",{client_key:a.L.client_key,user_id:localStorage.getItem("il_user_id"),plan_type:2},{headers:(new g.WM).set("content-type","application/x-www-form-urlencoded")}).subscribe(n=>{e.then(o=>{o.dismiss()}),this.resultObj=n,200==this.resultObj.code&&(this.plans=this.resultObj.plans,this.capPerDay=this.resultObj.cap_perday)},n=>{e.then(o=>{o.dismiss()})})}buySubscription(e){let n=this.loadingCtrl.create({message:"Please wait..."});n.then(o=>{o.present()}),this.http.post(a.L.baseURL+"/services/saveTempSubscription",{client_key:a.L.client_key,user_id:localStorage.getItem("il_user_id"),subscription_plan_id:e.subscription_plan_id,payable_amt:e.discount_price},{headers:(new g.WM).set("content-type","application/x-www-form-urlencoded")}).subscribe(o=>{n.then(c=>{c.dismiss()}),this.resultObj=o,200==this.resultObj.code?(this.tempSubscriptionID=this.resultObj.temp_subscription_id,this.pgOrderID=this.resultObj.pg_order_id,this.makePayment()):this.toastCtrl.create({message:"Something went wrong. Please try again..",position:"top",duration:2700,cssClass:"custom-failure-class"}).then(c=>{c.present()})},o=>{n.then(c=>{c.dismiss()}),this.toastCtrl.create({message:"Something went wrong. Please try again..",position:"top",duration:2700,cssClass:"custom-failure-class"}).then(c=>{c.present()})})}getPGKeys(){this.http.post(a.L.baseURL+"/services/getPGKeys",{client_key:a.L.client_key},{headers:(new g.WM).set("content-type","application/x-www-form-urlencoded")}).subscribe(e=>{this.resultObj=e,this.PGKey=200==this.resultObj.code?this.resultObj.api_key:""},e=>{this.PGKey=""})}makePayment(){return(0,x.mG)(this,void 0,void 0,function*(){const e={key:this.PGKey,amount:100*this.paymentAmt,description:"Online Payment",image:"",order_id:this.pgOrderID,currency:"INR",name:"Itslets",prefill:{email:localStorage.getItem("il_email"),contact:localStorage.getItem("il_email"),name:localStorage.getItem("il_user_name")},theme:{color:"#064CB5"}};try{let n=yield y.open(e);const o=this.loadingCtrl.create({message:"Please wait.."});o.then(u=>{u.present()});const c={client_key:a.L.client_key,user_id:localStorage.getItem("il_user_id"),temp_subscription_id:this.tempSubscriptionID,payID:n.response.razorpay_payment_id,orderID:n.response.razorpay_order_id,signature:n.response.razorpay_signature};this.http.post(a.L.baseURL+"/services/saveSubscription",c,{headers:(new g.WM).set("content-type","application/x-www-form-urlencoded")}).subscribe(u=>{o.then(m=>{m.dismiss()}),this.resultObj=u,200===this.resultObj.code?this.router.navigate(["my-subscription"]):this.toastCtrl.create({message:this.resultObj.message,position:"top",duration:2700,cssClass:"custom-failure-class"}).then(m=>{m.present()})},u=>{o.then(m=>{m.dismiss()})})}catch(n){this.toastCtrl.create({message:n.message,position:"top",duration:2700,cssClass:"custom-failure-class"}).then(o=>{o.present()})}})}}return s.\u0275fac=function(e){return new(e||s)(t.Y36(r.SH),t.Y36(g.eN),t.Y36(r.yF),t.Y36(r.t4),t.Y36(r.HT),t.Y36(b.F0),t.Y36(b.gz))},s.\u0275cmp=t.Xpm({type:s,selectors:[["app-packages"]],decls:20,vars:2,consts:[[1,"transparent-navbar","white-text"],["slot","start"],[1,"dark-bg","white-text","ion-padding"],[1,"full-content"],[1,"close-button",3,"click"],["name","close-circle"],[1,"subscription-holder"],[1,"subscription-top"],[1,"subscription-bottom"],["class","subscription-box",4,"ngFor","ngForOf"],[1,"full-content","condition-text"],[1,"full-content","help-text"],[1,"subscription-box"],[1,"subscription-text"],[1,"subscription-time"],[1,"subscription-price"],[1,"subscription-buy",3,"click"]],template:function(e,n){1&e&&(t.TgZ(0,"ion-header")(1,"ion-toolbar",0)(2,"ion-buttons",1),t._UZ(3,"ion-back-button"),t.qZA(),t.TgZ(4,"ion-title"),t._uU(5,"Packages"),t.qZA()()(),t.TgZ(6,"ion-content",2)(7,"div",3)(8,"div",4),t.NdJ("click",function(){return n.navCtrl.pop()}),t._UZ(9,"ion-icon",5),t.qZA()(),t.TgZ(10,"div",3)(11,"div",6)(12,"div",7),t._uU(13,"Packages"),t.qZA(),t.TgZ(14,"div",8),t.YNc(15,p,11,3,"div",9),t.qZA()(),t.TgZ(16,"div",10),t._uU(17),t.qZA(),t.TgZ(18,"div",11),t._uU(19," Recurring billing, cancel Anytime. "),t.qZA()()()),2&e&&(t.xp6(15),t.Q6J("ngForOf",n.plans),t.xp6(2),t.hij(" *Unlimited lets capped to ",n.capPerDay," Lets per day "))},dependencies:[f.sg,r.oU,r.Sm,r.W2,r.Gu,r.gu,r.wd,r.sr,r.cs],styles:[".subscription-holder[_ngcontent-%COMP%]{display:flex;flex-direction:column;margin-top:20px}.subscription-top[_ngcontent-%COMP%]{display:flex;width:100%;justify-content:center;font-size:20px;color:#fff;padding:30px 0;border-radius:10px 10px 0 0;background-image:linear-gradient(to bottom,#31d286,#35dc90,#39e69b,#3cf0a5,#40fab0)}.subscription-bottom[_ngcontent-%COMP%]{display:flex;width:100%;flex-direction:row;min-height:100px;flex-wrap:wrap}.subscription-box[_ngcontent-%COMP%]{border:solid 1px #EEE;float:left;width:33.333%;background-color:#fff}.subscription-text[_ngcontent-%COMP%], .subscription-time[_ngcontent-%COMP%], .subscription-price[_ngcontent-%COMP%], .subscription-validity[_ngcontent-%COMP%], .subscription-buy[_ngcontent-%COMP%]{float:left;width:100%;text-align:center;font-size:12px;color:#8f9190}.subscription-text[_ngcontent-%COMP%]{padding-top:10px;font-size:28px}.subscription-time[_ngcontent-%COMP%]{font-weight:800;margin-bottom:5px}.subscription-price[_ngcontent-%COMP%]{font-weight:800;color:#6b6b6b;margin-bottom:5px}.subscription-price[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{color:#8d8d8d;text-decoration:line-through}.subscription-validity[_ngcontent-%COMP%]{color:#666;margin-bottom:5px}.subscription-buy[_ngcontent-%COMP%]{background-color:#065efe;color:#fff;padding:10px 0}.close-button[_ngcontent-%COMP%]{float:right;height:25px;width:25px;margin-bottom:15px;font-size:25px}.close-button[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%]{color:#fff}.condition-text[_ngcontent-%COMP%], .help-text[_ngcontent-%COMP%]{font-size:13px;color:#777;text-align:right;margin-top:15px}.help-text[_ngcontent-%COMP%]{margin-top:50px;text-align:center;color:#a5a2a2}.scroll-content[_ngcontent-%COMP%]{background-color:rgba(0,0,0,.8)}"]}),s})()}];let l=(()=>{class s{}return s.\u0275fac=function(e){return new(e||s)},s.\u0275mod=t.oAB({type:s}),s.\u0275inj=t.cJS({imports:[b.Bz.forChild(h),b.Bz]}),s})(),C=(()=>{class s{}return s.\u0275fac=function(e){return new(e||s)},s.\u0275mod=t.oAB({type:s}),s.\u0275inj=t.cJS({imports:[f.ez,_.u5,r.Pc,l]}),s})()},3120:(M,P,i)=>{i.r(P),i.d(P,{Checkout:()=>b,CheckoutWeb:()=>r});var f=i(5861),_=i(7423);class r extends _.Uw{constructor(){super({name:"Checkout",platforms:["web"]})}echo(a){return(0,f.Z)(function*(){return console.log("ECHO",a),a})()}open(a){return(0,f.Z)(function*(){return console.log(a),new Promise((g,O)=>{var v,t,p=a;p.handler=function(l){console.log(l.razorpay_payment_id),g({response:l})},p["modal.ondismiss"]=function(){O(JSON.stringify({code:2,description:"Payment Canceled by User"}))};var y=0;p.hasOwnProperty("retry")&&!0===p.retry.enabled&&(y=p.retry.max_count);var k=document.getElementsByTagName("script")[0],h=document.createElement("script");h.id="rzp-jssdk",h.setAttribute("src","https://checkout.razorpay.com/v1/checkout.js"),null===(v=k.parentNode)||void 0===v||v.appendChild(h),h.addEventListener("load",()=>{try{(t=new window.Razorpay(p)).open(),t.on("payment.failed",l=>{var C;(y-=1)<0&&(console.log(l),null===(C=k.parentNode)||void 0===C||C.removeChild(h),O(l.error))})}catch(l){O({response:l})}})})})()}}const b=(0,_.fo)("Checkout",{web:()=>Promise.resolve().then(i.bind(i,3120)).then(x=>new x.CheckoutWeb)})}}]);