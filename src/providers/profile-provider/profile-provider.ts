import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { apiUrl } from '../../../secret';

/*
  Generated class for the Message provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProfileProvider {
    constructor(public httpClient: HttpClient) {}

    load() {
        return new Promise(resolve => {
            this.httpClient.get( apiUrl + 'user')
                .subscribe(data => {
                    var profile = data;
                    profile.level = Math.floor(data.experience / 1000) + 1;
                    profile.experienceForNextLevel = data.experience - ((profile.level -  1) * 1000 );
                    resolve(profile);
                });
        });
    }
}
