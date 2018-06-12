import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AngularFireAuth } from 'angularfire2/auth';

//Services
import { AuthService } from '../providers/auth/auth-service';

//Pages
import { SigninPage } from '../pages/signin/signin';
import { GeralPage } from '../pages/geral/geral';
import { CategoriaListPage } from '../pages/categoria/categoria-list/categoria-list';
import { DespesaListPage } from '../pages/despesa/despesa-list/despesa-list';
import { CreditoListPage } from '../pages/credito/credito-list/credito-list';
import { GastoListPage } from '../pages/gasto/gasto-list/gasto-list';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('NAV') nav: Nav;
  rootPage: any;
  public pages: Array<{ titulo: string, component: any, icon: string }>;
  isGeralPage = false;
  private possuiCategoriaCadastrada: boolean = false;

  constructor(platform: Platform, 
              statusBar: StatusBar, 
              splashScreen: SplashScreen,
              afAuth: AngularFireAuth,
              private authService: AuthService) {
    afAuth.authState.subscribe(user => {
      if (user) {
        this.rootPage = GeralPage;
      } else {
        this.rootPage = SigninPage;
      }
    });

    this.isGeralPage = this.rootPage == GeralPage;
    
    this.pages = [
      { titulo: 'Informações Gerais', component: GeralPage, icon: 'md-pie'},
      { titulo: 'Categoria', component: CategoriaListPage, icon: 'md-list-box'},
      { titulo: 'Despesa', component: DespesaListPage, icon: 'md-list-box'},
      { titulo: 'Crédito', component: CreditoListPage, icon: 'md-card'},
      { titulo: 'Controle Financeiro', component: GastoListPage, icon: 'md-list-box'},
      { titulo: 'Sair', component: 'sair', icon: 'md-log-out'}
    ];

    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  goToPage(page){
    if ('sair' === page) {
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

