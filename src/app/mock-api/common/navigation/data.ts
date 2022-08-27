/* tslint:disable:max-line-length */
import { NavigationItem } from 'src/@ekbz/components/navigation';

export const defaultNavigation: NavigationItem[] = [
    {
        id      : 'apps',
        title   : 'Applications',
        subtitle: 'Les applications du CEP Evry',
        type    : 'group',
        icon    : 'heroicons_outline:home',
        children: [
            {
                id   : 'apps.ressources',
                title: 'Les Ressources',
                type : 'basic',
                icon : 'heroicons_outline:academic-cap',
                link : '/apps/ressources'
            },
            {
                id   : 'apps.contacts',
                title: 'Gestion des membres',
                type : 'basic',
                icon : 'heroicons_outline:user-group',
                link : '/apps/contacts'
            },
       ]
    },
    {
        id      : 'administration',
        title   : 'Administration',
        subtitle: 'Administration du site',
        type    : 'group',
        icon    : 'heroicons_outline:home',
        children: [
            {
                id   : 'administration.Project',
                title: 'Project',
                type : 'basic',
                icon : 'heroicons_outline:chart-pie',
                link : '/admin/example'
            },
            {
                id   : 'administration.Dashboard',
                title: 'Visualisation des tableaux de bord',
                type : 'basic',
                icon : 'heroicons_outline:chart-pie',
                link : '/admin/dashboard'
              }
       ]
    },

];
export const compactNavigation: NavigationItem[] = [
    {
        id      : 'dashboards',
        title   : 'Dashboards',
        tooltip : 'Dashboards',
        type    : 'aside',
        icon    : 'heroicons_outline:home',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'apps',
        title   : 'Apps',
        tooltip : 'Apps',
        type    : 'aside',
        icon    : 'heroicons_outline:qrcode',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
];
export const futuristicNavigation: NavigationItem[] = [
    {
        id      : 'dashboards',
        title   : 'DASHBOARDS',
        type    : 'group',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'apps',
        title   : 'APPS',
        type    : 'group',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
];
export const horizontalNavigation: NavigationItem[] = [
    {
        id      : 'dashboards',
        title   : 'Dashboards',
        type    : 'group',
        icon    : 'heroicons_outline:home',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'apps',
        title   : 'Apps',
        type    : 'group',
        icon    : 'heroicons_outline:qrcode',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
];
