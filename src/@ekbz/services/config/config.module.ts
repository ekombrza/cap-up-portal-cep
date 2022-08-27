import { ModuleWithProviders, NgModule } from '@angular/core';
import { ConfigService } from 'src/@ekbz/services/config/config.service';
import { APP_CONFIG } from 'src/@ekbz/services/config/config.constants';

@NgModule()
export class ConfigModule
{
    /**
     * Constructor
     */
    constructor(private _ConfigService: ConfigService)
    {
    }

    /**
     * forRoot method for setting user configuration
     *
     * @param config
     */
    static forRoot(config: any): ModuleWithProviders<ConfigModule>
    {
        return {
            ngModule : ConfigModule,
            providers: [
                {
                    provide : APP_CONFIG,
                    useValue: config
                }
            ]
        };
    }
}
