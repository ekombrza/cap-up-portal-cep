import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ExtraOptions, PreloadAllModules, RouteReuseStrategy, RouterModule } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EkbzModule } from 'src/@ekbz';
import { ConfigModule } from 'src/@ekbz/services/config';
import { FuseMockApiModule } from 'src/@ekbz/lib/mock-api';
import { mockApiServices } from './mock-api';
import { appConfig } from './models-services/config/app.config';
import { LayoutModule } from './layout/layout.module';
import { CoreModule } from './models-services/core.module';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

// the second parameter 'fr' is optional
registerLocaleData(localeFr, 'fr');

const routerConfig: ExtraOptions = {
  preloadingStrategy       : PreloadAllModules,
  scrollPositionRestoration: 'enabled'
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule, 
    BrowserAnimationsModule,
    EkbzModule, 
    ConfigModule.forRoot(appConfig),
    FuseMockApiModule.forRoot(mockApiServices),
    // Core module of your application
    CoreModule,

    // Layout module of your application
    LayoutModule,
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {provide: LOCALE_ID, useValue: 'fr' }],
  bootstrap: [AppComponent],
})
export class AppModule {}
