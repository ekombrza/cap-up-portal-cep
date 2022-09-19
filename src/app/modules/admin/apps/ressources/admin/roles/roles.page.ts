import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { debounceTime, map, merge, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { ConfirmationService } from 'src/@ekbz/services/confirmation';
import { Role, RolePagination } from 'src/app/models-services/role/role.model';
import { RoleService } from 'src/app/models-services/role/role.service';

@Component({
  selector: 'app-role',
  templateUrl: './roles.page.html',
  styleUrls: ['./roles.page.scss'],
})
export class RolePage implements OnInit, AfterViewInit, OnDestroy
{
  
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    roles$: Observable<Role[]>;
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    pagination: RolePagination;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedRole: Role | null = null;
    selectedRoleForm: UntypedFormGroup;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: ConfirmationService,
        private _formBuilder: UntypedFormBuilder,
        private _roleService: RoleService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {

        this.pagination  = { 
            length: 10,
            size: 25,
            page: 0,
            lastPage: 0,
            startIndex: 0,
            endIndex: 0
        }


        // Create the selected product form
        this.selectedRoleForm = this._formBuilder.group({
            id               : [''],
            name             : ['', [Validators.required]],
            typeRole      : ['', [Validators.required]],
            description   : ['']
        });

        
        // Get the products
        this.roles$ = this._roleService.roles$;
        
        // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap((query) => {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._roleService.getRoles({
                        'applicationId.equals':1,
                        'page':this._paginator.pageIndex,
                        'size':this._paginator.pageSize,
                        });
                }),
                map(() => {
                    this.isLoading = false;
                })
            )
            .subscribe();
    }

    /**
     * After view init
     */
    ngAfterViewInit(): void
    {
        if ( this._sort && this._paginator )
        {
            // Set the initial sort
            this._sort.sort({
                id          : 'name',
                start       : 'asc',
                disableClear: true
            });

            // Mark for check
            //this._changeDetectorRef.markForCheck();

            // If the user changes the sort order...
            this._sort.sortChange
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(() => {
                    // Reset back to the first page
                    this._paginator.pageIndex = 0;

                    // Close the details
                    this.closeDetails();
                });

            // Get roles if sort or page changes
            merge(this._sort.sortChange, this._paginator.page).pipe(
                switchMap(() => {
                    console.log('change sort or change page')
                    this.closeDetails();
                    this.isLoading = true;
                    
                    return this._roleService.getRoles(
                        {
                            'applicationId.equals':1,
                            'page':this._paginator.pageIndex,
                            'size':this._paginator.pageSize,
                            'sort':[this._sort.active + ',' + this._sort.direction]
                        } 
                    );
                }),
                map(() => {
                    this.isLoading = false;
                })
            ).subscribe();
        }
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle catregorie details
     *
     * @param roletId
     */
    toggleDetails(roleId: number): void
    {
        // If the role is already selected...
        if ( this.selectedRole && this.selectedRole.id === roleId )
        {
            // Close the details
            this.closeDetails();
            return;
        }

        // Get the role by id
        this._roleService.getRoleById(roleId)
            .subscribe((role) => {

                // Set the selected role
                this.selectedRole = role;

                // Fill the form
                this.selectedRoleForm.patchValue(role);

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * Close the details
     */
    closeDetails(): void
    {
        this.selectedRole = null;
    }


    /**
     * Create role
     */
    createRole(): void
    {
        // Create the role
        this._roleService.createRole(1).subscribe((newRole) => {

            // Go to new role
            this.selectedRole = newRole;

            // Fill the form
            this.selectedRoleForm.patchValue(newRole);

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

    /**
     * Update the selected role using the form data
     */
    updateSelectedRole(): void
    {
        // Get the role object
        const role = this.selectedRoleForm.getRawValue();

        

        // Update the role on the server
        this._roleService.updateRole(role.id, role).subscribe(() => {

            // Show a success message
            this.showFlashMessage('success');
        });
    }

    /**
     * Delete the selected role using the form data
     */
    deleteSelectedRole(): void
    {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title  : 'Suppression Role',
            message: 'Êtes-vous sûr de vouloir supprimer cette catégorie? Cette action est irréversible!',
            actions: {
                confirm: {
                    label: 'Suppression'
                }
            }
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {

            // If the confirm button pressed...
            if ( result === 'confirmed' )
            {

                // Get the role object
                const product = this.selectedRoleForm.getRawValue();

                // Delete the product on the server
                this._roleService.deleteRole(product.id).subscribe(() => {

                    // Close the details
                    this.closeDetails();
                });
            }
        });
    }

    /**
     * Show flash message
     */
    showFlashMessage(type: 'success' | 'error'): void
    {
        // Show the message
        this.flashMessage = type;

        // Mark for check
        this._changeDetectorRef.markForCheck();

        // Hide it after 3 seconds
        setTimeout(() => {

            this.flashMessage = null;

            // Mark for check
            this._changeDetectorRef.markForCheck();
        }, 3000);
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }

}
