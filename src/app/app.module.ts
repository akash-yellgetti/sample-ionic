import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { NativeGeocoder } from '@awesome-cordova-plugins/native-geocoder/ngx';
import { Diagnostic } from '@awesome-cordova-plugins/diagnostic/ngx';
import { FileTransfer } from '@awesome-cordova-plugins/file-transfer/ngx';
import { FCM } from '@awesome-cordova-plugins/fcm/ngx';
import { Clipboard } from '@awesome-cordova-plugins/clipboard/ngx';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { InAppPurchase2 } from '@ionic-native/in-app-purchase-2/ngx';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';
import { SERVER_URL } from '../config/config';
const config: SocketIoConfig = { url: SERVER_URL.socketURL, options: {} };
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, SocketIoModule.forRoot(config)],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, Geolocation, NativeGeocoder, Diagnostic, FileTransfer, FCM, Clipboard, SocialSharing, InAppPurchase2, ImagePicker],
  bootstrap: [AppComponent]
})
export class AppModule {}


