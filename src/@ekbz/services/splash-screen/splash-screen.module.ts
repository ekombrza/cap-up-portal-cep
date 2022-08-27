import { NgModule } from '@angular/core';
import { SplashScreenService } from 'src/@ekbz/services/splash-screen/splash-screen.service';

@NgModule({
    providers: [
        SplashScreenService
    ]
})
export class SplashScreenModule
{
    /**
     * Constructor
     */
    constructor(private _splashScreenService: SplashScreenService)
    {
    }
}
