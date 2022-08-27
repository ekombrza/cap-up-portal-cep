import { NgModule } from '@angular/core';
import { PreloadAllModules, Route, RouterModule, Routes } from '@angular/router';
import { InitialDataResolver } from './app.resolvers';
import { AuthGuard } from './core/auth/guards/auth.guard';
import { NoAuthGuard } from './core/auth/guards/noAuth.guard';
import { LayoutComponent } from './layout/layout.component';

const routes: Route[] = [
  // Redirect empty path to '/apps/ressources'
{path: '', pathMatch : 'full', redirectTo: 'apps/ressources'},

// Redirect signed in user to the '/apps/ressources'
//
// After the user signs in, the sign in page will redirect the user to the 'signed-in-redirect'
// path. Below is another redirection for that path to redirect the user to the desired
// location. This is a small convenience to keep all main routes together here on this file.
{path: 'signed-in-redirect', pathMatch : 'full', redirectTo: 'apps/ressources'},

// Auth routes for guests
{
    path: '',
    canActivate: [NoAuthGuard],
    canActivateChild: [NoAuthGuard],
    component: LayoutComponent,
    data: {
        layout: 'empty'
    },
    children: [
        {path: 'confirmation-required', loadChildren: () => import('src/app/modules/auth/confirmation-required/confirmation-required.module').then(m => m.AuthConfirmationRequiredModule)},
        {path: 'forgot-password', loadChildren: () => import('src/app/modules/auth/forgot-password/forgot-password.module').then(m => m.AuthForgotPasswordModule)},
        {path: 'reset-password', loadChildren: () => import('src/app/modules/auth/reset-password/reset-password.module').then(m => m.AuthResetPasswordModule)},
        {path: 'sign-in', loadChildren: () => import('src/app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule)},
        {path: 'sign-up', loadChildren: () => import('src/app/modules/auth/sign-up/sign-up.module').then(m => m.AuthSignUpModule)}
    ]
},

// Auth routes for authenticated users
{
    path: '',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: LayoutComponent,
    data: {
        layout: 'empty'
    },
    children: [
        {path: 'sign-out', loadChildren: () => import('src/app/modules/auth/sign-out/sign-out.module').then(m => m.AuthSignOutModule)},
        {path: 'unlock-session', loadChildren: () => import('src/app/modules/auth/unlock-session/unlock-session.module').then(m => m.AuthUnlockSessionModule)}
    ]
},

// Landing routes
{
    path: '',
    component  : LayoutComponent,
    data: {
        layout: 'empty'
    },
    children   : [
        {path: 'home', loadChildren: () => import('src/app/modules/landing/home/home.module').then(m => m.LandingHomeModule)},
    ]
},

// Admin routes
{
    path       : '',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component  : LayoutComponent,
    resolve    : {
        initialData: InitialDataResolver,
    },
    children   : [
        // Apps
        {path: 'apps', children: [
            {path: 'ressources', loadChildren: () => import('src/app/modules/admin/apps/academy/academy.module').then(m => m.AcademyModule)},
        ]},
        // Administration
        {path: 'admin', children: [
            {path: 'example', loadChildren: () => import('src/app/modules/admin/admin/example/example.module').then(m => m.ExampleModule)},
        ]},

    ]
}

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, scrollPositionRestoration: 'enabled' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
