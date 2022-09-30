import { Route } from '@angular/router';
import { MembresDetailsComponent } from './details/details.component';
import { MembresListComponent } from './list/list.component';
import { MembresComponent } from './membres.component';
import { CanDeactivateMembresDetails } from './membres.guards';
import { MembresCountriesResolver, MembresMembreResolver, MembresResolver } from './membres.resolvers';


export const membresRoutes: Route[] = [
    {
        path     : '',
        component: MembresComponent,
        children : [
            {
                path     : '',
                component: MembresListComponent,
                resolve  : {
                    membres : MembresResolver,
                    countries: MembresCountriesResolver,
                },
                children : [
                    {
                        path         : ':id',
                        component    : MembresDetailsComponent,
                        resolve      : {
                            membre  : MembresMembreResolver,
                            countries: MembresCountriesResolver,
                        },
                        canDeactivate: [CanDeactivateMembresDetails]
                    }
                ]
            }
        ]
    }
];
