import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrl } from '../../../secret';

/*
  Generated class for the Message provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MessageProvider {

  constructor(public http: HttpClient) {
    console.log('Hello MessageProvider');
  }

  load() {
    return new Promise(resolve => {
      this.http.get( apiUrl + 'message')
        .subscribe(data => {
          resolve(data);
        });
    });
  }

}
