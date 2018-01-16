import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrl } from '../../../secret';
import { tap } from 'rxjs/operators';

/*
  Generated class for the Message provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProfileProvider {
    profile: any;

    constructor(public httpClient: HttpClient) {}

    load() {
        return new Promise(resolve => {
            this.httpClient.get( apiUrl + 'user')
                .subscribe(data => {
                    this.profile = data;

                    if(data['experience']) {
                        this.profile.level = Math.floor(data['experience'] / 1000) + 1;
                        this.profile.experienceForNextLevel = data['experience'] - ((this.profile.level -  1) * 1000 );
                    } else {
                        this.profile.level = 1;
                        this.profile.experienceForNextLevel = 0;
                    }

                    if(!this.profile.messagesSent) {
                        this.profile.messagesSent = 0;
                    }

                    if(!this.profile.messagesReceived) {
                        this.profile.messagesReceived = 0;
                    }

                    resolve(this.profile);
                });
        });
    }

    update(profile) {
        let body = new URLSearchParams();
        body.set('name', profile.name);
        body.set('age', profile.age);
        body.set('email', profile.email);
        body.set('password', profile.password);

        if(profile.newPassword) {
            body.set('new_password', profile.newPassword);
        }

        return this.httpClient.patch( apiUrl + 'user', body.toString())
            .pipe(tap(response => {
                return response;
            }))
    }
}