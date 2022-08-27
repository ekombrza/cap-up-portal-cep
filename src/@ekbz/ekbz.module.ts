import { NgModule, Optional, SkipSelf } from '@angular/core';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { SplashScreenModule } from 'src/@ekbz/services/splash-screen/splash-screen.module';
import { LoadingModule } from './services/loading';
import { MediaWatcherModule } from './services/media-watcher';
import { PlatformModule } from './services/platform/platform.module';
import { UtilsModule } from './services/utils';

@NgModule({
    imports  : [
        //ConfirmationModule,
        LoadingModule,
        MediaWatcherModule,
        PlatformModule,
        SplashScreenModule,
        UtilsModule
    ],
    providers: [
        {
            // Disable 'theme' sanity check
            provide : MATERIAL_SANITY_CHECKS,
            useValue: {
                doctype: true,
                theme  : false,
                version: true
            }
        },
        {
            // Use the 'fill' appearance on Angular Material form fields by default
            provide : MAT_FORM_FIELD_DEFAULT_OPTIONS,
            useValue: {
                appearance: 'fill'
            }
        }
    ]
})
export class EkbzModule
{
    /**
     * Constructor
     */
    constructor(@Optional() @SkipSelf() parentModule?: EkbzModule)
    {
        if ( parentModule )
        {
            throw new Error('EkbzModule has already been loaded. Import this module in the AppModule only!');
        }
    }
}
