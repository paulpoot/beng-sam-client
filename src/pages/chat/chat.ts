import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MessageProvider } from '../../providers/message-provider/message-provider';
import { Observable } from 'rxjs/Rx';
import { JwtHelperService } from "@auth0/angular-jwt";
import { apiUrl } from "../../../secret";
import { AuthProvider } from "../../providers/auth/auth";
import { HttpClient } from "@angular/common/http";

/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
  providers: [MessageProvider]
})
export class ChatPage {
  public messages: any;
  user: string;
  message: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private readonly authProvider: AuthProvider,
              jwtHelper: JwtHelperService,
              private readonly httpClient: HttpClient,
              public messageProvider: MessageProvider) {

    this.authProvider.authUser.subscribe(jwt => {
      if (jwt) {
        const decoded = jwtHelper.decodeToken(jwt);
        this.user = decoded.sub
      }
      else {
        this.user = null;
      }
    });
    
    this.loadMessages();

    Observable.interval(500000).subscribe(x => {
      this.loadMessages();
    });
  }

  loadMessages() {
    this.messageProvider.load()
    .then(data => {
      this.messages = data;
    });
  }

  ionViewWillEnter() {
    this.httpClient.get(apiUrl + '/secret', {responseType: 'text'}).subscribe(
      text => this.message = text,
      err => console.log(err)
    );
  }

  logout() {
    this.authProvider.logout();
  }

}
