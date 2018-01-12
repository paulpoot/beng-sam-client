import { Component, ViewChild } from '@angular/core';
import { LoadingController, ToastController } from 'ionic-angular';
import { NgModel } from "@angular/forms";
import { AuthProvider } from "../../providers/auth/auth";
import { finalize } from 'rxjs/operators/finalize';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {

  @ViewChild('username')
  usernameModel: NgModel;

  constructor(private readonly authProvider: AuthProvider,
              private readonly loadingCtrl: LoadingController,
              private readonly toastCtrl: ToastController) {
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

  private showSuccesToast(jwt) {
    if (jwt !== 'EXISTS') {
      const toast = this.toastCtrl.create({
        message: 'Registreren voltooid!',
        duration: 3000,
        position: 'bottom'
      });

      toast.present();
    }
    else {
      const toast = this.toastCtrl.create({
        message: 'E-mailadres is al in gebruik.',
        duration: 3000,
        position: 'bottom'
      });

      toast.present();

      this.usernameModel.control.setErrors({'usernameTaken': true});
    }
  }

  handleError(error: any) {
    let message = `Er is een onverwachte fout opgetreden: ${error.statusText}`;

    const toast = this.toastCtrl.create({
      message,
      duration: 5000,
      position: 'bottom'
    });

    toast.present();
  }

}