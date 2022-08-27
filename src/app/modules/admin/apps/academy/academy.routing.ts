import { Route } from '@angular/router';
import { AcademyComponent } from 'src/app/modules/admin/apps/academy/academy.component';
import { AcademyListComponent } from 'src/app/modules/admin/apps/academy/list/list.component';
import { AcademyDetailsComponent } from 'src/app/modules/admin/apps/academy/details/details.component';
import { AcademyCategoriesResolver, AcademyCourseResolver, AcademyCoursesResolver } from 'src/app/modules/admin/apps/academy/academy.resolvers';

export const academyRoutes: Route[] = [
    {
        path     : '',
        component: AcademyComponent,
        resolve  : {
            categories: AcademyCategoriesResolver
        },
        children : [
            {
                path     : '',
                pathMatch: 'full',
                component: AcademyListComponent,
                resolve  : {
                    courses: AcademyCoursesResolver
                }
            },
            {
                path     : ':id',
                component: AcademyDetailsComponent,
                resolve  : {
                    course: AcademyCourseResolver
                }
            }
        ]
    }
];
