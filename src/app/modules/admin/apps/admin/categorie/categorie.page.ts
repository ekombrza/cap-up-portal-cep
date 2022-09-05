import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { debounceTime, map, merge, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { ConfirmationService } from 'src/@ekbz/services/confirmation';
import { Categorie, CategoriePagination } from 'src/app/models-services/categorie/categorie.model';
import { CategorieService } from 'src/app/models-services/categorie/categorie.service';

@Component({
  selector: 'app-categorie',
  templateUrl: './categorie.page.html',
  styleUrls: ['./categorie.page.scss'],
})
export class CategoriePage implements OnInit, AfterViewInit, OnDestroy
{
  
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    categories$: Observable<Categorie[]>;
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    pagination: CategoriePagination;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedCategorie: Categorie | null = null;
    selectedCategorieForm: UntypedFormGroup;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: ConfirmationService,
        private _formBuilder: UntypedFormBuilder,
        private _categorieService: CategorieService
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
        this.selectedCategorieForm = this._formBuilder.group({
            id               : [''],
            name             : ['', [Validators.required]],
            typeResourceEnum      : ['', [Validators.required]],
        });

        
        // Get the products
        this.categories$ = this._categorieService.categories$;
        
        // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap((query) => {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._categorieService.getCategories({
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

            // Get categories if sort or page changes
            merge(this._sort.sortChange, this._paginator.page).pipe(
                switchMap(() => {
                    console.log('change sort or change page')
                    this.closeDetails();
                    this.isLoading = true;
                    
                    return this._categorieService.getCategories(
                        {
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
     * @param categorietId
     */
    toggleDetails(categorieId: number): void
    {
        // If the categorie is already selected...
        if ( this.selectedCategorie && this.selectedCategorie.id === categorieId )
        {
            // Close the details
            this.closeDetails();
            return;
        }

        // Get the categorie by id
        this._categorieService.getCategorieById(categorieId)
            .subscribe((categorie) => {

                // Set the selected categorie
                this.selectedCategorie = categorie;

                // Fill the form
                this.selectedCategorieForm.patchValue(categorie);

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * Close the details
     */
    closeDetails(): void
    {
        this.selectedCategorie = null;
    }


    /**
     * Create categorie
     */
    createCategorie(): void
    {
        // Create the categorie
        this._categorieService.createCategorie().subscribe((newCategorie) => {

            // Go to new categorie
            this.selectedCategorie = newCategorie;

            // Fill the form
            this.selectedCategorieForm.patchValue(newCategorie);

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

    /**
     * Update the selected categorie using the form data
     */
    updateSelectedCategorie(): void
    {
        // Get the categorie object
        const categorie = this.selectedCategorieForm.getRawValue();

        

        // Update the categorie on the server
        this._categorieService.updateCategorie(categorie.id, categorie).subscribe(() => {

            // Show a success message
            this.showFlashMessage('success');
        });
    }

    /**
     * Delete the selected categorie using the form data
     */
    deleteSelectedCategorie(): void
    {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title  : 'Suppression Categorie',
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

                // Get the categorie object
                const product = this.selectedCategorieForm.getRawValue();

                // Delete the product on the server
                this._categorieService.deleteCategorie(product.id).subscribe(() => {

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
