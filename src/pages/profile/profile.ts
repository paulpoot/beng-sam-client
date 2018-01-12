import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { ProfileProvider } from '../../providers/profile-provider/profile-provider';
import { finalize } from 'rxjs/operators';
import { LoginPage } from '../login/login';


/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
  providers: [ProfileProvider]
})
export class ProfilePage {
  public profile: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public profileProvider: ProfileProvider, public authProvider: AuthProvider, 
    public loadingCtrl: LoadingController, public toastCtrl: ToastController) {
  }

  saveProfile(profile) {
    let loader = this.loadingCtrl.create({
      content: "Wijzigingen opslaan...",
    });
    loader.present();

    this.profileProvider.update(profile)
      .pipe(finalize(() => loader.dismiss()))
      .subscribe(
        (data) => this.showToast('Wijzigingen opgeslagen'),
        err => {
          if(err.status === 401) {
            this.showToast('Wachtwoord onjuist');
          } else if(err.status === 500) {
            this.showToast('Opslaan mislukt');
          }
        });
  }

  public showToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });

    toast.present();
  }

  public logout() {
    this.authProvider.logout();
    this.navCtrl.push(LoginPage);
  }

  ionViewWillEnter() {
    this.profileProvider.load()
    .then(data => {
      this.profile = data;
      console.log(data);
    })

  }

}
