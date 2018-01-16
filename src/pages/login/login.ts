import { Component, ViewChild } from '@angular/core';
import { NavController, LoadingController, ToastController } from 'ionic-angular';
import { AuthProvider } from "../../providers/auth/auth";
import { finalize } from 'rxjs/operators/finalize';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  @ViewChild('loginCard') loginCard;
  @ViewChild('signupCard') signupCard;
  public showRegisterForm: boolean = false;

  constructor(private readonly navCtrl: NavController,
              private readonly loadingCtrl: LoadingController,
              private readonly authProvider: AuthProvider,
              private readonly toastCtrl: ToastController) {
  }

  login(value: any) {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Inloggen...'
    });

    loading.present();

    this.authProvider
      .login(value)
      .pipe(finalize(() => loading.dismiss()))
      .subscribe(
        () => {},
        err => this.handleError(err));
  }

  signup(value: any) {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Account aanmaken...'
    });

    loading.present();

    this.authProvider
      .signup(value)
      .pipe(finalize(() => loading.dismiss()))
      .subscribe(
        (jwt) => this.showSuccesToast(jwt),
        err => this.handleError(err));
  }

  showSignup() {
    var loginCardCL = this.loginCard.nativeElement.classList;
    var signupCardCL = this.signupCard.nativeElement.classList;

    loginCardCL.add('fadeOutDown');
    Observable.timer(750).subscribe(x => {
      loginCardCL.add('hidden');
      loginCardCL.remove('fadeOutDown');

      signupCardCL.add('fadeInUp');
      signupCardCL.remove('hidden');
      Observable.timer(750).subscribe(x => {
        signupCardCL.remove('fadeInUp');
      })
    });
  }

  showLogin() {
    var loginCardCL = this.loginCard.nativeElement.classList;
    var signupCardCL = this.signupCard.nativeElement.classList;

    signupCardCL.add('fadeOutDown');
    Observable.timer(750).subscribe(x => {
      signupCardCL.add('hidden');
      signupCardCL.remove('fadeOutDown');

      loginCardCL.add('fadeInUp');
      loginCardCL.remove('hidden');
      Observable.timer(750).subscribe(x => {
        loginCardCL.remove('fadeInUp');
      })
    });
  }

  showSuccesToast(jwt) {
    const toast = this.toastCtrl.create({
      duration: 3000,
      position: 'bottom'
    });

    if (jwt !== 'EXISTS') {
      toast.setMessage('Registreren voltooid!');
    } else {
      toast.setMessage('E-mailadres is al in gebruik.');
    }
    
    toast.present();
  }

  handleError(error: any) {
    const toast = this.toastCtrl.create({
      duration: 3000,
      position: 'bottom'
    });

    if (error.status && error.status === 401) {
      toast.setMessage('Inloggen mislukt');
    }
    else {
      toast.setMessage(`Er is een onverwachte fout opgetreden: ${error.statusText}`);
    }

    toast.present();
  }

}