import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { apiUrl } from '../../../secret';
import { Storage } from "@ionic/storage";
import { HttpErrorResponse } from '@angular/common/http/src/response';

/*
  Generated class for the Message provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MessageProvider {
    private firstLoad = true;

    constructor(public httpClient: HttpClient, 
                private storage: Storage) {}

    load() {
        return new Promise(resolve => {
            this.getConversationLastModified()
            .then(data => {
                var headers;
                if(this.firstLoad) {
                    this.firstLoad = false;
                } else if(data) {
                    headers = new HttpHeaders().set('If-Modified-Since', data)            
                }

                this.httpClient.get( apiUrl + 'conversation', {
                    headers: headers,
                    observe: 'response'
                })
                    .subscribe(response => {
                        this.setConversationLastModified(response.headers.get('Last-Modified'));
                        resolve(response.body);
                    }, (err: HttpErrorResponse) => {
                        if(err.status != 304) {
                            console.log(err);
                        }
                    })
            })

        });
    }

    submit(message) {
        let body = new URLSearchParams();
        body.set('content', message);

        return new Promise(resolve => {
            this.httpClient.post( apiUrl + 'message', body.toString())
                .subscribe(data => {
                    resolve(data);
                })
        })
    }

    getConversationLastModified() {
        return this.storage.get('conversation_last_modified');        
    }

    setConversationLastModified(timestamp) {
        return this.storage.set('conversation_last_modified', timestamp);
    }
}
