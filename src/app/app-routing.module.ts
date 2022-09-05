import { NgModule } from '@angular/core';
import { PreloadAllModules, Route, RouterModule, Routes } from '@angular/router';
import { InitialDataResolver } from './app.resolvers';

import { LayoutComponent } from './layout/layout.component';
import { AuthGuard } from './models-services/auth/guards/auth.guard';
import { NoAuthGuard } from './models-services/auth/guards/noAuth.guard';

const routes: Route[] = [
  // Redirect empty path to '/apps/ressources'
{path: '', pathMatch : 'full', redirectTo: 'public/home'},

// Redirect signed in user to the '/apps/ressources'
//
// After the user signs in, the sign in page will redirect the user to the 'signed-in-redirect'
// path. Below is another redirection for that path to redirect the user to the desired
// location. This is a small convenience to keep all main routes together here on this file.
{path: 'signed-in-redirect', pathMatch : 'full', redirectTo: 'public/home'},

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
        {path: 'reset-password-init', loadChildren: () => import('src/app/modules/auth/reset-password/reset-password.module').then(m => m.AuthResetPasswordModule)},
        {path: 'activate', loadChildren: () => import('src/app/modules/auth/activate/activate.module').then(m => m.AuthActivateModule)},
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
    path: 'public',
    component  : LayoutComponent,
    data: {
        layout: 'empty'
    },
    children   : [
        {path: 'home', loadChildren: () => import('src/app/modules/landing/home/home.module').then(m => m.LandingHomeModule)},
    ]
},

// apps routes
{
    path       : 'apps',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component  : LayoutComponent,
    resolve    : {
        initialData: InitialDataResolver,
    },
    children   : [
        
        // ressources/ressources
        {path: 'ressources', children: [
            {path: 'ressources', loadChildren: () => import('src/app/modules/admin/apps/ressources/resources/resources.module').then(m => m.ResourcesPageModule)},
        ]},
        // ressources/formations
        {path: 'ressources', children: [
            {path: 'formations', loadChildren: () => import('src/app/modules/admin/apps/ressources/resources/resources.module').then(m => m.ResourcesPageModule)},
        ]},
        // ressources/dashboard
        {path: 'ressources', children: [
            {path: 'dashboard', loadChildren: () => import('src/app/modules/admin/apps/ressources/dashboard/dashboard.module').then(m => m.DashboardPageModule)},
        ]},
        {
            path: 'admin',
            children   : [
                { path: 'categorie', loadChildren: () => import('./modules/admin/apps/admin/categorie/categorie.module').then( m => m.CategoriePageModule)},
            ]
        }
    ]
},

// admin routes
{
    path       : 'admin',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component  : LayoutComponent,
    resolve    : {
        initialData: InitialDataResolver,
    },
    children   : [
        
        // church
        {path: 'church', loadChildren: () => import('src/app/modules/admin/admin/eglise/eglise.module').then(m => m.EglisePageModule)},
        // profil
        {path: 'profil', loadChildren: () => import('src/app/modules/admin/admin/profil/profil.module').then(m => m.ProfilPageModule)},
        // setting
        {path: 'settings', loadChildren: () => import('src/app/modules/admin/admin/settings/settings.module').then(m => m.SettingsModule)},

    ]
},

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, scrollPositionRestoration: 'enabled' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
