import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap} from 'rxjs/operators/tap';
import { ReplaySubject, Observable} from "rxjs";
import { apiUrl } from '../../../secret';
import { Storage } from "@ionic/storage";
import { JwtHelperService} from "@auth0/angular-jwt"; 

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {
  private jwtTokenName = 'jwt_token';
  
    authUser = new ReplaySubject<any>(1);
  
    constructor(private readonly httpClient: HttpClient,
                private readonly storage: Storage,
                private readonly jwtHelper: JwtHelperService) {
    }
  
    checkLogin() {
      this.storage.get(this.jwtTokenName).then(jwt => {
        if (jwt && !this.jwtHelper.isTokenExpired(jwt)) {
          this.httpClient.get(apiUrl + 'auth/authenticate')
            .subscribe(() => this.authUser.next(jwt),
              (err) => this.storage.remove(this.jwtTokenName).then(() => this.authUser.next(null)));
          // OR
          // this.authUser.next(jwt);
        }
        else {
          this.storage.remove(this.jwtTokenName).then(() => this.authUser.next(null));
        }
      });
    }
  
    login(values: any): Observable<any> {
      let body = new URLSearchParams();
      body.set('email', values.email);
      body.set('password', values.password);

      let options = {
        headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
      };

      return this.httpClient.post(apiUrl + 'auth/login', 
        body.toString(), options)
        .pipe(tap(jwt => this.handleJwtResponse(jwt)));
    }
  
    logout() {
      this.storage.remove(this.jwtTokenName).then(() => this.authUser.next(null));
    }
  
    signup(values: any): Observable<any> {
      return this.httpClient.post(apiUrl + 'auth/register', values, {responseType: 'text'})
        .pipe(tap(jwt => {
          if (jwt !== 'EXISTS') {
            return this.handleJwtResponse(jwt);
          }
          return jwt;
        }));
    }
  
    private handleJwtResponse(jwt: string) {
      return this.storage.set(this.jwtTokenName, jwt)
        .then(() => this.authUser.next(jwt))
        .then(() => jwt);
    }
  
  }