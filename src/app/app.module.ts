import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database/database.module';
import { AngularFireAuthModule } from 'angularfire2/auth';

//Services
import { AuthService } from '../providers/auth/auth-service';

//Providers
import { CategoriaProvider } from '../providers/categoria/categoria';

//Pages
import { MyApp } from './app.component';
import { SigninPage } from '../pages/signin/signin';
import { SignupPage } from '../pages/signup/signup';
import { ResetpasswordPage } from '../pages/resetpassword/resetpassword';
import { GeralPage } from '../pages/geral/geral';
import { CategoriaListPage } from '../pages/categoria/categoria-list/categoria-list';

export const firebaseConfig = {
  apiKey: "AIzaSyD4tHeCMbZ4xhE9ASCsx_tzbugyU0ULtbo",
  authDomain: "myexpenses-e8a9a.firebaseapp.com",
  databaseURL: "https://myexpenses-e8a9a.firebaseio.com",
  projectId: "myexpenses-e8a9a",
  storageBucket: "myexpenses-e8a9a.appspot.com",
  messagingSenderId: "319823109104"
};

@NgModule({
  declarations: [
    MyApp,
    SigninPage,
    SignupPage,
    ResetpasswordPage,
    GeralPage,
    CategoriaListPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SigninPage,
    SignupPage,
    ResetpasswordPage,
    GeralPage,
    CategoriaListPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService,
    CategoriaProvider
  ]
})
export class AppModule {}
