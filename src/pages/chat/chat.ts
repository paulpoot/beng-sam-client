import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MessageProvider } from '../../providers/message-provider/message-provider';
import { Observable } from 'rxjs/Rx';
import { apiUrl } from "../../../secret";
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

  message: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private readonly httpClient: HttpClient,
              public messageProvider: MessageProvider) {
    
    this.loadMessages();

    Observable.interval(3000).subscribe(x => {
      this.loadMessages();
    });
  }

  loadMessages() {
    this.messageProvider.load()
    .then(data => {
      this.messages = data;
    });
  }

  submit(values: any) {
    this.messageProvider.submit(values.message)
    .then(data => {
      this.loadMessages();
      this.message = null;
    })
  }

  ionViewWillEnter() {
    this.httpClient.get(apiUrl + '/secret', {responseType: 'text'}).subscribe(
      text => this.message = text,
      err => console.log(err)
    );
  }
}
