import { Component, ViewChild } from '@angular/core';
import { Platform, IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { MessageProvider } from '../../providers/message-provider/message-provider';
import { Observable } from 'rxjs/Rx';
import { apiUrl } from "../../../secret";
import { HttpClient } from "@angular/common/http";
import { AuthProvider } from "../../providers/auth/auth";
import { LoginPage } from "../login/login";

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
    @ViewChild(Content) content: any;
    public messages: any;
    public urlRegex = /(?:https?|ftp):\/\/[\n\S]+/g;
    message: string;
    lastMessage: any;

    constructor(public platform: Platform,
            public navCtrl: NavController, 
            public navParams: NavParams,
            private readonly httpClient: HttpClient,
            public messageProvider: MessageProvider,
            private readonly authProvider: AuthProvider) {
    
        this.loadMessages();

        Observable.interval(3000).subscribe(x => {
            this.loadMessages();
        });
    }

    loadMessages() {
        this.messageProvider.load()
        .then(data => {
            this.messages = data;
            this.lastMessage = this.messages[this.messages.length -1];
            var self = this;
            this.messages.forEach(function(item, index) {
                if(item.type == 'link') {
                    if(item.content.indexOf('https://www.youtube.com/watch?v=') !== -1) {
                        item.link = item.content.match(self.urlRegex)[0];
                        var videoId = item.link.split('v=')[1];
                        item.image = 'https://img.youtube.com/vi/' + videoId + '/0.jpg';
                    }
                }
            });

            this.scrollDown();
        });
    }

    pressMessage(message) {
        if(message.type == 'link') {
            this.platform.ready().then(() => {
                window.open(message.content.match(this.urlRegex)[0], "_system");
            });
        }
    }

    submit(values: any) {
        this.messageProvider.submit(values.message)
        .then(data => {
            this.loadMessages();
            this.message = null;
            this.messages.push({ content: values.message });
            this.scrollDown();
        })
    }

    logout() {
        this.authProvider.logout();
        this.navCtrl.push(LoginPage);    
    }

    ionViewWillEnter() {
        this.httpClient.get(apiUrl + '/secret', {responseType: 'text'}).subscribe(
            text => this.message = text,
            err => console.log(err)
        );
    }

    scrollDown() {
        setTimeout(() => {
            document.getElementById('scrollTo').scrollIntoView(false)
        }, 1000);
    }
}
