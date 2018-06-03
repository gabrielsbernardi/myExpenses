import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database/database.module';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { DespesaDetalhePage } from '../pages/despesa-detalhe/despesa-detalhe';
import { SigninPage } from '../pages/signin/signin';
import { SignupPage } from '../pages/signup/signup';
import { ResetpasswordPage } from '../pages/resetpassword/resetpassword';

import { DespesasService } from '../services/despesas.service';
import { AuthService } from '../providers/auth/auth-service';

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
    HomePage,
    DespesaDetalhePage,
    SigninPage,
    SignupPage,
    ResetpasswordPage
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
    HomePage,
    DespesaDetalhePage,
    SigninPage,
    SignupPage,
    ResetpasswordPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DespesasService,
    AuthService
  ]
})
export class AppModule {}
