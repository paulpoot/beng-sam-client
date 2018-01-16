import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { CustomFormsModule } from 'ng2-validation';
import { Storage, IonicStorageModule } from "@ionic/storage";
import { Interceptor } from '../providers/interceptor/interceptor';

import { MyApp } from './app.component';
import { ChatPage } from '../pages/chat/chat';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { HighlightsPage } from '../pages/highlights/highlights';
import { AuthProvider } from '../providers/auth/auth';
import { MessageProvider } from '../providers/message-provider/message-provider';
import { ProfileProvider } from '../providers/profile-provider/profile-provider';
import { SettingsPage } from '../pages/settings/settings';
import { apiUrl } from '../../secret';

@NgModule({
  declarations: [
    MyApp,
    ChatPage,
    LoginPage,
    ProfilePage,
    HighlightsPage,
    SettingsPage
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
    LoginPage,
    ProfilePage,
    HighlightsPage,
    SettingsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    MessageProvider,
    AuthProvider,
    ProfileProvider,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: Interceptor,
      multi: true
    }
  ]
})
export class AppModule {}

export function jwtOptionsFactory(storage: Storage) {
  return {
    tokenGetter: () => storage.get('jwt_token'),
    whitelistedDomains: [apiUrl]
  }
}