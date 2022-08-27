import { NgModule } from '@angular/core';
import { UtilsService } from 'src/@ekbz/services/utils/utils.service';

@NgModule({
    providers: [
        UtilsService
    ]
})
export class UtilsModule
{
    /**
     * Constructor
     */
    constructor(private _utilsService: UtilsService)
    {
    }
}
