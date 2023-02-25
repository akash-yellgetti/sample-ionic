import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // {
  //   path: '',
  //   loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  // },
  {
    path: '',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'registration',
    loadChildren: () => import('./registration/registration.module').then( m => m.RegistrationPageModule)
  },
  {
    path: 'accepted-waiting/:letsID',
    loadChildren: () => import('./accepted-waiting/accepted-waiting.module').then( m => m.AcceptedWaitingPageModule)
  },
  {
    path: 'acepted-user/:letsID/:accpUserID',
    loadChildren: () => import('./acepted-user/acepted-user.module').then( m => m.AceptedUserPageModule)
  },
  {
    path: 'active-lets/:letsID',
    loadChildren: () => import('./active-lets/active-lets.module').then( m => m.ActiveLetsPageModule)
  },
  {
    path: 'change-password',
    loadChildren: () => import('./change-password/change-password.module').then( m => m.ChangePasswordPageModule)
  },
  {
    path: 'discover',
    loadChildren: () => import('./discover/discover.module').then( m => m.DiscoverPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'home/:tempLetsID',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'invite-friends',
    loadChildren: () => import('./invite-friends/invite-friends.module').then( m => m.InviteFriendsPageModule)
  },
  {
    path: 'lets-request',
    loadChildren: () => import('./lets-request/lets-request.module').then( m => m.LetsRequestPageModule)
  },
  {
    path: 'login-otp/:userID',
    loadChildren: () => import('./login-otp/login-otp.module').then( m => m.LoginOtpPageModule)
  },
  {
    path: 'my-subscription',
    loadChildren: () => import('./my-subscription/my-subscription.module').then( m => m.MySubscriptionPageModule)
  },
  {
    path: 'no-lets-user/:message',
    loadChildren: () => import('./no-lets-user/no-lets-user.module').then( m => m.NoLetsUserPageModule)
  },
  {
    path: 'packages/:tempLetsID',
    loadChildren: () => import('./packages/packages.module').then( m => m.PackagesPageModule)
  },
  {
    path: 'packages',
    loadChildren: () => import('./packages/packages.module').then( m => m.PackagesPageModule)
  },
  {
    path: 'pet-reg-details',
    loadChildren: () => import('./pet-reg-details/pet-reg-details.module').then( m => m.PetRegDetailsPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'profile-edit/:editFlag',
    loadChildren: () => import('./profile-edit/profile-edit.module').then( m => m.ProfileEditPageModule)
  },
  {
    path: 'profile-edit',
    loadChildren: () => import('./profile-edit/profile-edit.module').then( m => m.ProfileEditPageModule)
  },
  {
    path: 'profile-gallery/:editFlag',
    loadChildren: () => import('./profile-gallery/profile-gallery.module').then( m => m.ProfileGalleryPageModule)
  },
  {
    path: 'profile-gallery',
    loadChildren: () => import('./profile-gallery/profile-gallery.module').then( m => m.ProfileGalleryPageModule)
  },
  {
    path: 'profile-tag',
    loadChildren: () => import('./profile-tag/profile-tag.module').then( m => m.ProfileTagPageModule)
  },
  {
    path: 'reciever-active-lets/:letsID',
    loadChildren: () => import('./reciever-active-lets/reciever-active-lets.module').then( m => m.RecieverActiveLetsPageModule)
  },
  {
    path: 'refer-code',
    loadChildren: () => import('./refer-code/refer-code.module').then( m => m.ReferCodePageModule)
  },
  {
    path: 'regprofile',
    loadChildren: () => import('./regprofile/regprofile.module').then( m => m.RegprofilePageModule)
  },
  {
    path: 'subscriptions/:tempLetsID',
    loadChildren: () => import('./subscriptions/subscriptions.module').then( m => m.SubscriptionsPageModule)
  },
  {
    path: 'subscriptions',
    loadChildren: () => import('./subscriptions/subscriptions.module').then( m => m.SubscriptionsPageModule)
  },
  {
    path: 'reset-password/:userID',
    loadChildren: () => import('./reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  },
  {
    path: 'lets-selfi/:letsID/:accpUserID',
    loadChildren: () => import('./lets-selfi/lets-selfi.module').then( m => m.LetsSelfiPageModule)
  },
  {
    path: 'privacy',
    loadChildren: () => import('./privacy/privacy.module').then( m => m.PrivacyPageModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./about/about.module').then( m => m.AboutPageModule)
  },
  {
    path: 'regotp/:tempUserID',
    loadChildren: () => import('./regotp/regotp.module').then( m => m.RegotpPageModule)
  },
  {
    path: 'plans/:tempLetsID',
    loadChildren: () => import('./plans/plans.module').then( m => m.PlansPageModule)
  },
  {
    path: 'plans',
    loadChildren: () => import('./plans/plans.module').then( m => m.PlansPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
