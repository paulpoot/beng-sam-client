import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrl } from '../../../secret';
import { Storage } from "@ionic/storage";

/*
  Generated class for the Message provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MessageProvider {
  

  constructor(public httpClient: HttpClient) {}

  load() {
    return new Promise(resolve => {
      this.httpClient.get( apiUrl + 'conversation')
        .subscribe(data => {
          resolve(data);
        });
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

}
