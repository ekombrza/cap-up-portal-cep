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
                    id      : 'ressources.administration',
                    title   : 'Administration',
                    subtitle: 'Administration des ressources',
                    type    : 'group',
                    icon    : 'heroicons_outline:home',
                    roles: ['1::Administrateur'],
                    children: [
                        {
                            id   : 'administration.ressources.Categories',
                            title: 'Gestion des Catégories',
                            type : 'basic',
                            icon : 'heroicons_outline:adjustments',
                            roles: ['1::Administrateur'],
                            link : '/apps/ressources/admin/categorie'
                        },
                        {
                            id   : 'administration.ressources.TypeFile',
                            title: 'Gestion des types de fichiers',
                            type : 'basic',
                            icon : 'heroicons_outline:adjustments',
                            roles: ['1::Administrateur'],
                            link : '/apps/ressources/admin/type-files'
                        },
                        {
                            id   : 'administration.ressources.Roles',
                            title: 'Gestion des rôles',
                            type : 'basic',
                            icon : 'heroicons_outline:adjustments',
                            roles: ['1::Administrateur'],
                            link : '/apps/ressources/admin/roles'
                        },
                        {
                            id   : 'administration.ressources.ValidateAccess',
                            title: 'Validation demandes Accès',
                            type : 'basic',
                            icon : 'heroicons_outline:check',
                            roles: ['1::Administrateur'],
                            link : '/apps/ressources/admin/demande-autorisation'
                        }
                ]
                }
        ]
    },
    {
        id: 'contacts',
        nav: [
                {
                    id      : 'contacts',
                    title   : 'Contacts',
                    subtitle: 'gestion des contacts',
                    type    : 'group',
                    icon    : 'heroicons_outline:home',
                    roles: ['3::acces-contact'],
                    children: [
                        {
                            id   : 'contacts.contacts',
                            title: 'Les Contacts',
                            type : 'basic',
                            icon : 'heroicons_outline:users',
                            link : '/apps/contacts/contacts'
                        }
                ]
                },
                {
                    id      : 'contacts.administration',
                    title   : 'Administration',
                    subtitle: 'Administration des contacts',
                    type    : 'group',
                    icon    : 'heroicons_outline:home',
                    roles: ['3::administrateur'],
                    children: [
                        {
                            id   : 'administration.contacts.Equipes',
                            title: 'Gestion des Equipes',
                            type : 'basic',
                            icon : 'heroicons_outline:adjustments',
                            roles: ['3::administrateur'],
                            link : '/apps/contacts/admin/equipes'
                        },
                        {
                            id   : 'administration.contacts.Roles',
                            title: 'Gestion des rôles',
                            type : 'basic',
                            icon : 'heroicons_outline:adjustments',
                            roles: ['3::administrateur'],
                            link : '/apps/contacts/admin/roles'
                        }
                ]
                }
        ]
    }
];

