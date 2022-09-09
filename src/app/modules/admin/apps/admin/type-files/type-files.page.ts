import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { debounceTime, map, merge, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { ConfirmationService } from 'src/@ekbz/services/confirmation';
import { TypeFile, TypefilePagination } from 'src/app/models-services/type-file/type-file.model';
import { TypeFileService } from 'src/app/models-services/type-file/type-file.service';

@Component({
  selector: 'app-typeFile',
  templateUrl: './type-files.page.html',
  styleUrls: ['./type-files.page.scss'],
})
export class TypeFilePage implements OnInit, AfterViewInit, OnDestroy
{
  
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    typeFiles$: Observable<TypeFile[]>;
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    pagination: TypefilePagination;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedTypeFile: TypeFile | null = null;
    selectedTypeFileForm: UntypedFormGroup;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: ConfirmationService,
        private _formBuilder: UntypedFormBuilder,
        private _typeFileService: TypeFileService
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
        this.selectedTypeFileForm = this._formBuilder.group({
            id               : [''],
            name             : ['', [Validators.required]],
            typeTypeFile      : ['', [Validators.required]],
            description   : ['']
        });

        
        // Get the products
        this.typeFiles$ = this._typeFileService.typeFiles$;
        
        // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap((query) => {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._typeFileService.getTypeFiles({
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

            // Get typeFiles if sort or page changes
            merge(this._sort.sortChange, this._paginator.page).pipe(
                switchMap(() => {
                    console.log('change sort or change page')
                    this.closeDetails();
                    this.isLoading = true;
                    
                    return this._typeFileService.getTypeFiles(
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
     * @param typeFiletId
     */
    toggleDetails(typeFileId: number): void
    {
        // If the typeFile is already selected...
        if ( this.selectedTypeFile && this.selectedTypeFile.id === typeFileId )
        {
            // Close the details
            this.closeDetails();
            return;
        }

        // Get the typeFile by id
        this._typeFileService.getTypeFileById(typeFileId)
            .subscribe((typeFile) => {

                // Set the selected typeFile
                this.selectedTypeFile = typeFile;

                // Fill the form
                this.selectedTypeFileForm.patchValue(typeFile);

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * Close the details
     */
    closeDetails(): void
    {
        this.selectedTypeFile = null;
    }


    /**
     * Create typeFile
     */
    createTypeFile(): void
    {
        // Create the typeFile
        this._typeFileService.createTypeFile().subscribe((newTypeFile) => {

            // Go to new typeFile
            this.selectedTypeFile = newTypeFile;

            // Fill the form
            this.selectedTypeFileForm.patchValue(newTypeFile);

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

    /**
     * Update the selected typeFile using the form data
     */
    updateSelectedTypeFile(): void
    {
        // Get the typeFile object
        const typeFile = this.selectedTypeFileForm.getRawValue();

        

        // Update the typeFile on the server
        this._typeFileService.updateTypeFile(typeFile.id, typeFile).subscribe(() => {

            // Show a success message
            this.showFlashMessage('success');
        });
    }

    /**
     * Delete the selected typeFile using the form data
     */
    deleteSelectedTypeFile(): void
    {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title  : 'Suppression TypeFile',
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

                // Get the typeFile object
                const product = this.selectedTypeFileForm.getRawValue();

                // Delete the product on the server
                this._typeFileService.deleteTypeFile(product.id).subscribe(() => {

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
