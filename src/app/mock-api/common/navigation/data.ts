/* tslint:disable:max-line-length */
import { ListNavigationItem, NavigationItem } from 'src/@ekbz/components/navigation';


export const defaultNavigation: ListNavigationItem[] = [
    {
        id: 'ressources',
        nav: [
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
                    roles: ['Administrateur'],
                    children: [
                        {
                            id   : 'administration.Categories',
                            title: 'Gestion des Catégories',
                            type : 'basic',
                            icon : 'heroicons_outline:adjustments',
                            roles: ['Administrateur'],
                            link : '/apps/admin/categorie'
                        },
                        {
                            id   : 'administration.TypeFile',
                            title: 'Gestion des types de fichiers',
                            type : 'basic',
                            icon : 'heroicons_outline:adjustments',
                            roles: ['Administrateur'],
                            link : '/apps/admin/type-files'
                        },
                        {
                            id   : 'administration.Roles',
                            title: 'Gestion des rôles',
                            type : 'basic',
                            icon : 'heroicons_outline:adjustments',
                            roles: ['Administrateur'],
                            link : '/apps/admin/roles'
                        },
                        {
                            id   : 'administration.ValidateAccess',
                            title: 'Validation demandes Accès',
                            type : 'basic',
                            icon : 'heroicons_outline:check',
                            roles: ['Administrateur'],
                            link : '/apps/admin/demande-autorisation'
                        }
                ]
                }
        ]
    },
    {
        id: 'contacts',
        nav: [
                {
                    id      : 'ressources',
                    title   : 'Ressources',
                    subtitle: 'Les ressources du CEP Evry2',
                    type    : 'group',
                    icon    : 'heroicons_outline:home',
                    children: [
                        {
                            id   : 'ressources.formations',
                            title: 'Les Formations2',
                            type : 'basic',
                            icon : 'heroicons_outline:academic-cap',
                            link : '/apps/ressources/formations'
                        },
                        {
                            id   : 'ressources.ressources',
                            title: 'Les Ressources2',
                            type : 'basic',
                            icon : 'heroicons_solid:archive',
                            link : '/apps/ressources/ressources'
                        },
                        {
                            id   : 'ressources.dashboard',
                            title: 'Tableau de bord2',
                            type : 'basic',
                            icon : 'heroicons_solid:identification',
                            link : '/apps/ressources/dashboard'
                        },
                ]
                },
                {
                    id      : 'administration',
                    title   : 'Administration',
                    subtitle: 'Administration des ressources2',
                    type    : 'group',
                    icon    : 'heroicons_outline:home',
                    roles: ['Administrateur'],
                    children: [
                        {
                            id   : 'administration.Categories',
                            title: 'Gestion des Catégories2',
                            type : 'basic',
                            icon : 'heroicons_outline:adjustments',
                            roles: ['Administrateur'],
                            link : '/apps/admin/categorie'
                        },
                        {
                            id   : 'administration.TypeFile',
                            title: 'Gestion des types de fichiers2',
                            type : 'basic',
                            icon : 'heroicons_outline:adjustments',
                            roles: ['Administrateur'],
                            link : '/apps/admin/type-files'
                        },
                        {
                            id   : 'administration.Roles',
                            title: 'Gestion des rôles2',
                            type : 'basic',
                            icon : 'heroicons_outline:adjustments',
                            roles: ['Administrateur'],
                            link : '/apps/admin/roles'
                        },
                        {
                            id   : 'administration.ValidateAccess',
                            title: 'Validation demandes Accès2',
                            type : 'basic',
                            icon : 'heroicons_outline:check',
                            roles: ['Administrateur'],
                            link : '/apps/admin/demande-autorisation'
                        }
                ]
                }
        ]
    }
];

