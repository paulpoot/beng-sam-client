import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClientModule } from '@angular/common/http';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { CustomFormsModule } from 'ng2-validation';
import { Storage, IonicStorageModule } from "@ionic/storage";

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ChatPage } from '../pages/chat/chat';
import { SignupPage } from '../pages/signup/signup';
import { LoginPage } from '../pages/login/login';
import { MessageProvider } from '../providers/message-provider/message-provider';
import { AuthProvider } from '../providers/auth/auth';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ChatPage,
    LoginPage,
    SignupPage,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [Storage]
      }
    }),
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    CustomFormsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ChatPage,
    HomePage,
    LoginPage,
    SignupPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    MessageProvider,
    AuthProvider
  ]
})
export class AppModule {}

export function jwtOptionsFactory(storage: Storage) {
  return {
    tokenGetter: () => storage.get('jwt_token'),
    whitelistedDomains: ['sam.app', 'api.teampopsicle.nl']
  }
}