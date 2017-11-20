import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MessageProvider } from '../../providers/message-provider/message-provider';
import { Observable } from 'rxjs/Rx';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public messageProvider: MessageProvider) {
    this.loadMessages();

    Observable.interval(1000 * 60).subscribe(x => {
      this.loadMessages();
    });
  }

  loadMessages() {
    this.messageProvider.load()
    .then(data => {
      this.messages = data;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
  }

}
