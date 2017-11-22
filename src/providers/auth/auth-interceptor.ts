import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { Storage } from "@ionic/storage";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private storage: Storage) {}

  intercept (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return fromPromise(this.getToken())
        .switchMap(token => {
            const authReq = req.clone({
                headers: req.headers.set('Authorization', 'Bearer ' + token)
                .set('Content-Type', 'application/x-www-form-urlencoded')
              });
              return next.handle(authReq);
        })
  }

  getToken() {
      return this.storage.get('jwt_token');
  }
}