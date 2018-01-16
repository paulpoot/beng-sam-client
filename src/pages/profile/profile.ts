import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { ProfileProvider } from '../../providers/profile-provider/profile-provider';
import { finalize } from 'rxjs/operators';
import { LoginPage } from '../login/login';
import { MessageProvider } from '../../providers/message-provider/message-provider';
import { SettingsPage } from '../settings/settings';

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
  providers: [ProfileProvider, MessageProvider]
})
export class ProfilePage {
  public profile: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public profileProvider: ProfileProvider, public messageProvider: MessageProvider,
    public authProvider: AuthProvider, public loadingCtrl: LoadingController, 
    public toastCtrl: ToastController, public alertCtrl: AlertController) {
  }

  requestHelp() {
    this.messageProvider.submit('Kan je me uitleggen wat de levels op de profielpagina betekenen?')
    .then((data) => {
      this.navCtrl.pop();
    });
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

  openSettings() {
    this.navCtrl.push(SettingsPage);
  }

  showToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });

    toast.present();
  }

  logout() {
    let confirm = this.alertCtrl.create({
      title: 'Uitloggen',
      message: 'Weet je zeker dat je wil uitloggen?',
      buttons: [
        {text: 'Annuleren'},
        {
          text: 'Uitloggen',
          handler: () => {
            this.authProvider.logout();
            this.navCtrl.push(LoginPage);
          }
        }
      ]
    });

    confirm.present();
  }

  ionViewWillEnter() {
    this.profileProvider.load()
    .then(data => {
      this.profile = data;
      console.log(data);
    })

  }

}
