import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { SigninPage } from '../pages/signin/signin';
import { DespesaDetalhePage } from '../pages/despesa-detalhe/despesa-detalhe';
import { AuthService } from '../providers/auth/auth-service';

import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('NAV') nav: Nav;
  rootPage: any;
  public pages: Array<{ titulo: string, component: any, icon: string }>;

  constructor(platform: Platform, 
              statusBar: StatusBar, 
              splashScreen: SplashScreen,
              afAuth: AngularFireAuth,
              private authService: AuthService) {
    afAuth.authState.subscribe(user => {
      if (user) {
        this.rootPage = HomePage;
      } else {
        this.rootPage = SigninPage;
      }
    });
    
    this.pages = [
      { titulo: 'Inicio', component: HomePage, icon: 'home'},
      { titulo: 'Despesa', component: DespesaDetalhePage, icon: 'person'},
      { titulo: 'Sair', component: 'sair', icon: 'person'}
    ];

    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  goToPage(page){
    if ("sair" === page) {
      this.signOut();
    } else {
      this.nav.setRoot(page);
    }
  }

  signOut() {
    this.authService.signOut()
      .then(() => {
        this.nav.setRoot(SigninPage);
      })
      .catch((error) => {
        console.error(error);
      })
  }
}

