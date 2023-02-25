import { Component } from '@angular/core';
import { NavController} from '@ionic/angular';
import { Events } from '../services/events';
import { Router } from '@angular/router';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})

export class ProfilePage {
  profilePic: string = '';
  constructor(public navCtrl: NavController, private events: Events, private router: Router) {
    this.profilePic = '.../../assets/imgs/default_profile_pic.jpg';
    if (localStorage.getItem("il_profile_pic") != null) {
      this.profilePic = localStorage.getItem("il_profile_pic");
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  showProfileGalleryPage() {
    this.router.navigate(['/profile-gallery',true]);
  }

  showEditProfilePage() {
    this.navCtrl.navigateForward('/profile-edit');
  }

  showSubscriptionsPage() {
    // this.navCtrl.navigateForward('/plans');
    // this.navCtrl.navigateForward('/subscriptions');
    this.navCtrl.navigateForward('/my-subscription');
  }

  showProfileTagPage() {
    this.navCtrl.navigateForward('/profile-tag');
  }

  showInviteFriendsPage() {
    this.navCtrl.navigateForward('/invite-friends');
  }

  showReferCodePage() {
    this.navCtrl.navigateForward('/refer-code');
  }
  
  showChangePassword(){
    this.navCtrl.navigateForward('/change-password');
  }

  goToPrivacy(){
    this.navCtrl.navigateForward('/privacy');
  }
  
  logOutUser() {
    this.events.publish('userlogout');
  }
  
  goToAbout(){
    this.navCtrl.navigateForward('/about');
  }
  
  goToHome(){
    this.navCtrl.navigateForward('/home');
  }
}
