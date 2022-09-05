/* tslint:disable:max-line-length */
import { NavigationItem } from 'src/@ekbz/components/navigation';

export const defaultNavigation: NavigationItem[] = [
    {
        id      : 'ressources',
        title   : 'Ressources',
        subtitle: 'Les ressources du CEP Evry',
        type    : 'group',
        icon    : 'heroicons_outline:home',
        children: [
            {
                id   : 'ressources.formations',
                title: 'Les Formations',
                type : 'basic',
                icon : 'heroicons_outline:academic-cap',
                link : '/apps/ressources/formations'
            },
            {
                id   : 'ressources.ressources',
                title: 'Les Ressources',
                type : 'basic',
                icon : 'heroicons_solid:archive',
                link : '/apps/ressources/ressources'
            },
            {
                id   : 'ressources.dashboard',
                title: 'Tableau de bord',
                type : 'basic',
                icon : 'heroicons_solid:identification',
                link : '/apps/ressources/dashboard'
            },
       ]
    },
    {
        id      : 'administration',
        title   : 'Administration',
        subtitle: 'Administration des ressources',
        type    : 'group',
        icon    : 'heroicons_outline:home',
        children: [
            {
                id   : 'administration.Categories',
                title: 'Gestion des Catégories',
                type : 'basic',
                icon : 'heroicons_outline:adjustments',
                link : '/apps/admin/categorie'
            },
            {
                id   : 'administration.TypeFile',
                title: 'Gestion des types de fichiers',
                type : 'basic',
                icon : 'heroicons_outline:adjustments',
                link : '/admin/dashboard'
            },
            {
                id   : 'administration.Roles',
                title: 'Gestion des rôles',
                type : 'basic',
                icon : 'heroicons_outline:adjustments',
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
