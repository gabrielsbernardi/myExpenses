import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { ImagePicker } from '@ionic-native/image-picker';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database/database.module';
import { AngularFireAuthModule } from 'angularfire2/auth';

//Services
import { AuthService } from '../providers/auth/auth-service';

//Providers
import { CategoriaProvider } from '../providers/categoria/categoria';
import { DespesaProvider } from '../providers/despesa/despesa';
import { CreditoProvider } from '../providers/credito/credito';

//Pipes
import { CategoriaSearchPipe } from '../pipes/categoria-search/categoria-search';
import { DespesaSearchPipe } from '../pipes/despesa-search/despesa-search';
import { CreditoSearchPipe } from '../pipes/credito-search/credito-search';
import { DecimalPipe } from '@angular/common';

//Pages
import { MyApp } from './app.component';
import { SigninPage } from '../pages/signin/signin';
import { SignupPage } from '../pages/signup/signup';
import { ResetpasswordPage } from '../pages/resetpassword/resetpassword';
import { GeralPage } from '../pages/geral/geral';
import { CategoriaListPage } from '../pages/categoria/categoria-list/categoria-list';
import { DespesaListPage } from '../pages/despesa/despesa-list/despesa-list';
import { CreditoListPage } from '../pages/credito/credito-list/credito-list';
import { GastoProvider } from '../providers/gasto/gasto';
import { GastoListPage } from '../pages/gasto/gasto-list/gasto-list';
import { GeralProvider } from '../providers/geral/geral';
import { Camera } from '@ionic-native/camera';

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
    CategoriaListPage,
    CategoriaSearchPipe,
    DespesaListPage,
    DespesaSearchPipe,
    CreditoListPage,
    CreditoSearchPipe,
    GastoListPage
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
    CategoriaListPage,
    DespesaListPage,
    CreditoListPage,
    GastoListPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService,
    CategoriaProvider,
    DespesaProvider,
    ImagePicker,
    CreditoProvider,
    GastoProvider,
    GeralProvider,
    DecimalPipe,
    Camera
  ]
})
export class AppModule {}
