import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { AngularFireModule } from 'angularfire2';
import { DespesasService } from '../services/despesas.service';
import { DespesaDetalhePage } from '../pages/despesa-detalhe/despesa-detalhe';
import { AngularFireDatabaseModule } from 'angularfire2/database/database.module';
import { AngularFireAuthModule } from 'angularfire2/auth/auth.module';

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
    DespesaDetalhePage
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
    DespesaDetalhePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DespesasService
  ]
})
export class AppModule {}
