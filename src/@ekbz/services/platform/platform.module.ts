import { NgModule } from '@angular/core';
import { PlatformService } from 'src/@ekbz/services/platform/platform.service';

@NgModule({
    providers: [
        PlatformService
    ]
})
export class PlatformModule
{
    /**
     * Constructor
     */
    constructor(private _platformService: PlatformService)
    {
    }
}
