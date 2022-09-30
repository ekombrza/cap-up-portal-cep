import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TemplatePortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { debounceTime, ignoreElements, map, Subject, takeUntil, tap } from 'rxjs';
import { Country, Tag } from '../membres.types';
import { MembresListComponent } from '../list/list.component';
import { MembresService } from '../membres.service';
import { ConfirmationService } from 'src/@ekbz/services/confirmation';
import { Membre } from 'src/app/models-services/membre/membre.model';
import { Telephone } from 'src/app/models-services/telephone/telephone.model';
import { Adress } from 'src/app/models-services/adress/adress.model';
import { Enfant } from 'src/app/models-services/enfant/enfant.model';
import { SituationFamille } from 'src/app/models-services/situation-famille/situation-famille.model';
import { SituationFamilleService } from 'src/app/models-services/situation-famille/situation-famille.service';
import { TypeAdhesion } from 'src/app/models-services/type-adhesion/type-adhesion.model';
import { TypeAdhesionService } from 'src/app/models-services/type-adhesion/type-adhesion.service';
import { AdressService } from 'src/app/models-services/adress/adress-service';
import dayjs from 'dayjs';
import { TelephoneService } from 'src/app/models-services/telephone/telephone.service';
import { EnfantService } from 'src/app/models-services/enfant/enfant.service';

@Component({
    selector       : 'membres-details',
    templateUrl    : './details.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MembresDetailsComponent implements OnInit, OnDestroy
{
    @ViewChild('avatarFileInput') private _avatarFileInput: ElementRef;

    editMode: boolean = false;
    telephones: Telephone[];
    enfants: Enfant[];
    membre: Membre;
    membreForm: UntypedFormGroup;
    membres: Membre[];
    countries: Country[];
    situationsFamille: SituationFamille[];
    typesAdhesion: TypeAdhesion[];
    listDeletedTelephones: Telephone[];
    listDeletedEnfants: Enfant[];
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _membresListComponent: MembresListComponent,
        private _membresService: MembresService,
        private _situationsService: SituationFamilleService,
        private _typeAdhesionService: TypeAdhesionService,
        private _adressService: AdressService,
        private _telephoneService: TelephoneService,
        private _enfantService: EnfantService,
        private _formBuilder: UntypedFormBuilder,
        private _fuseConfirmationService: ConfirmationService,
        private _renderer2: Renderer2,
        private _router: Router,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef
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
        // Open the drawer
        this._membresListComponent.matDrawer.open();

        // Create the membre form
        this.membreForm = this._formBuilder.group({
            id                   : [null],
            avatarImageLink      : [null],
            firstName            : ['', [Validators.required]],
            lastName             : ['', [Validators.required]],
            email                : ['', [Validators.required]],
            telephones           : this._formBuilder.array([]),
            enfants           : this._formBuilder.array([]),
            civilite             : [''],
            birthDate            : [null],
            adress              : this._formBuilder.group({
                adress1             : [''],
                adress2             : [''],
                city                : [''],
                region              : [''],
                postalCode          : [''],
                country             : [''],
            }),
            baptiseDepuis             : [null],
            frequenteEgliseDepuis   : [null],
            typeAdhesion            : [null],
            situationFamille        :[null],
            nomConjoint             : [null],
            prenomConjoint          : [null],
            notes                : [null],
        });

        this.listDeletedTelephones = [];
        this.listDeletedEnfants = [];
        this.telephones = [];
        this.enfants = [];

        // Get the membres
        this._membresService.membres$
            .pipe(takeUntil(this._unsubscribeAll))
            .pipe(tap(membres => membres.forEach(membre => {
                membre.background = '/assets/images/cards/14-640x480.jpg';
            })))
            .subscribe((membres: Membre[]) => {
                this.membres = membres;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the membre
        this._membresService.membre$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((membre: Membre) => {
                console.log('membre : ', membre)
                // Open the drawer in case it is closed
                this._membresListComponent.matDrawer.open();

                // Get the membre
                this.membre = membre;

                // Clear phoneNumbers form arrays
                (this.membreForm.get('telephones') as UntypedFormArray).clear();

                 // Clear phoneNumbers form arrays
                 (this.membreForm.get('enfants') as UntypedFormArray).clear();

                // Patch values to the form
                this.membreForm.patchValue(membre);

                // Toggle the edit mode off
                this.toggleEditMode(false);

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the country telephone codes
        this._membresService.countries$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((codes: Country[]) => {
                this.countries = codes;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

            // Get the telephone
            this.initTelephones();

            // Get the enfants
            this.initEnfants();
        
        // Get the adress 
            this._membresService.getAddresse({'membreId.equals':this.membre.id}).subscribe((adress) => {
            });
        
        
        this._membresService.adresse$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((adresse: Adress[]) => {
                console.log('adresse', adresse[0])
                this.membre.adress = adresse.length > 0 ? adresse[0]: null;
                if(!this.membre.adress){
                    this.membreForm.get('adress.adress1').patchValue('');
                    this.membreForm.get('adress.adress2').patchValue('');
                    this.membreForm.get('adress.city').patchValue('');
                    this.membreForm.get('adress.region').patchValue('');
                    this.membreForm.get('adress.postalCode').patchValue('');
                    this.membreForm.get('adress.country').patchValue('');
                   
                } else {
                    this.membreForm.get('adress').patchValue( this.membre.adress);
                }
               
                
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the enfants 
        this._membresService.getEnfants({'membreId.equals':this.membre.id}).subscribe((enfants) => {
        });
        
        this._membresService.enfants$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((enfants: Enfant[]) => {
                this.enfants = enfants;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        this._situationsService.getSituationsFamille().subscribe(() => {});
        this._situationsService.situationsFamille$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((situations: SituationFamille[]) => {
                this.situationsFamille = situations;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
        if(this.membre.situationFamille){
            this.membreForm.get('situationFamille').patchValue(this.membre.situationFamille)
        }
    
        // Get the type Adhesion 
        this._typeAdhesionService.getTypesAdhesion().subscribe(()=> {});
        this._typeAdhesionService.typesAdhesion$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((typesAdhesion: TypeAdhesion[]) => {
                this.typesAdhesion = typesAdhesion;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        if(this.membre.typeAdhesion){
            this.membreForm.get('typeAdhesion').patchValue(this.membre.typeAdhesion);
        }
        
        // Mark for check
        this._changeDetectorRef.markForCheck();
            
    }

    private initTelephones() {
        this._membresService.getTelephones({ 'membreId.equals': this.membre.id })
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((telephones: Telephone[]) => {
                this.telephones = telephones;

                // Setup the phone numbers form array
                const phoneNumbersFormGroups = [];

                if (this.telephones && this.telephones.length > 0) {
                    // Iterate through them
                    this.telephones.forEach((phoneNumber) => {

                        // Create an email form group
                        phoneNumbersFormGroups.push(
                            this._formBuilder.group({
                                id: [phoneNumber.id],
                                country: [phoneNumber.country],
                                phoneNumber: [phoneNumber.phoneNumber],
                                label: [phoneNumber.label]
                            })
                        );
                    });
                }

                else {
                    // Create a phone number form group
                    phoneNumbersFormGroups.push(
                        this._formBuilder.group({
                            id: [null],
                            country: ['fr'],
                            phoneNumber: [''],
                            label: ['']
                        })
                    );
                }

                // Add the phone numbers form groups to the phone numbers form array
                phoneNumbersFormGroups.forEach((phoneNumbersFormGroup) => {
                    (this.membreForm.get('telephones') as UntypedFormArray).push(phoneNumbersFormGroup);
                });

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }


    private initEnfants() {
        this._membresService.getEnfants({ 'membreId.equals': this.membre.id })
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((enfants: Enfant[]) => {
                this.enfants = enfants;

                // Setup the enfants form array
                const enfantsFormGroups = [];

                if (this.enfants && this.enfants.length > 0) {
                    // Iterate through them
                    this.enfants.forEach((enfant) => {

                        // Create an enfant form group
                        enfantsFormGroups.push(
                            this._formBuilder.group({
                                id: [enfant.id],
                                prenom: [enfant.prenom],
                                anneeNaissance: [enfant.anneeNaissance],
                                creationDate: [dayjs(enfant.creationDate)],
                                membre: [enfant.membre],
                            })
                        );
                    });
                }

                else {
                    // Create a enfant form group
                    enfantsFormGroups.push(
                        this._formBuilder.group({
                            id: [null],
                            prenom: [''],
                            anneeNaissance: [''],
                            creationDate: [dayjs()],
                            updateDate: [dayjs()],
                            membre: [this.membre],
                        })
                    );
                }

                // Add the enfant form groups to the enfants form array
                enfantsFormGroups.forEach((enfantsFormGroup) => {
                    (this.membreForm.get('enfants') as UntypedFormArray).push(enfantsFormGroup);
                });

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
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
     * Close the drawer
     */
    closeDrawer(): Promise<MatDrawerToggleResult>
    {
        return this._membresListComponent.matDrawer.close();
    }

    /**
     * Toggle edit mode
     *
     * @param editMode
     */
    toggleEditMode(editMode: boolean | null = null): void
    {
        if ( editMode === null )
        {
            this.editMode = !this.editMode;
        }
        else
        {
            this.editMode = editMode;
        }

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Update the membre
     */
    updateMembre(): void
    {
        // Get the membre object
        const membre: Membre = Object.assign({}, 
            this.membre, 
            this.membreForm.getRawValue()
          );
        //const membre: Membre = this.membreForm.getRawValue();
        console.log("membre.typeAdhesion selected", membre.typeAdhesion);
        console.log("membre.situationFamille selected", membre.situationFamille);
       
       
        console.log('membre', membre);
        // Go through the membre object and clear empty values
        //membre.emails = membre.emails.filter(email => email.email);
        this.telephones = this.telephones.filter(phoneNumber => phoneNumber.phoneNumber);
        this.enfants = this.enfants.filter(enfant => enfant.prenom);

        this.processPhoneNumber();
        this.processEnfants();

        // Update or create the adress
        membre.adress.updatedDate = dayjs();
       
        if(this.membre.adress){
            membre.adress.id = this.membre.adress.id;
            membre.adress.creationDate = dayjs(this.membre.adress.creationDate);
            this._adressService.update(membre.adress).subscribe((adress) => {

                // Update the membre on the server
                this._membresService.updateMembre(membre.id, membre).subscribe(() => {
                    //get adress
                    this._membresService.getAddresse({'membreId.equals':this.membre.id}).subscribe((adress) => {
                    });
                    // Toggle the edit mode off
                    this.toggleEditMode(false);
                    // Mark for check
                    this._changeDetectorRef.markForCheck();
                     // Get the telephone
                    this.initTelephones();
                    // Get the enfants
                    this.initEnfants();
                 });
            });
        }else {
            membre.adress.creationDate = dayjs();
            membre.adress.country = null;
            this._adressService.create(membre.adress).subscribe((adress) => {
                this.membre.adress = adress.body;
                membre.adress = adress.body;

               // Update the membre on the server
               this._membresService.updateMembre(membre.id, membre).subscribe(() => {
                    //get adress
                    this._membresService.getAddresse({'membreId.equals':this.membre.id}).subscribe((adress) => {
                    });
                    // Toggle the edit mode off
                    this.toggleEditMode(false);
                    // Mark for check
                    this._changeDetectorRef.markForCheck();

                    // Get the telephones
                    this.initTelephones();
                    // Get the enfants
                    this.initEnfants();
                });
               
            });
        }
    }

    processPhoneNumber() {
        // Delete the deleted phone
        this.listDeletedTelephones.forEach(phone => {
            const index = this.telephones.map((telephone => telephone.id)).indexOf(phone.id,0);
            if (index > -1) {
                this.telephones.splice(index, 1);
            }
   
            this._telephoneService.delete(phone.id).subscribe(()=>{});
            this.listDeletedTelephones = [];
            
        });
        // Add the new Phone 
        const phoneNumbersFormArray = this.membreForm.get('telephones') as UntypedFormArray;
        phoneNumbersFormArray.value.forEach((tel: Telephone)=> {
            if(!tel.id && tel.phoneNumber){
                tel.creationDate = dayjs();
                tel.updatedDate = dayjs();
                tel.membre = this.membre;
                this._telephoneService.create(tel).subscribe((tel)=>{
                    this.telephones.push(tel.body);
                });
                
            } else if(tel.id && tel.phoneNumber){
                const oldTel:Telephone = this.telephones.find(item => item.id === tel.id);
                const index = this.telephones.findIndex(item => item.id === tel.id);
                tel.creationDate = dayjs(oldTel.creationDate);
                tel.updatedDate = dayjs();
                tel.membre = oldTel.membre;
                this._telephoneService.update(tel).subscribe((tel)=>{
                if (index > -1) {
                    this.telephones.splice(index, 1);
                    this.telephones.push(tel.body);
                }
                });
            }
        });


    }

    processEnfants() {
        // Delete the deleted enfant
        this.listDeletedEnfants.forEach(enfant => {
            const index = this.enfants.map((enfant => enfant.id)).indexOf(enfant.id,0);
            if (index > -1) {
                this.enfants.splice(index, 1);
            }
   
            this._enfantService.delete(enfant.id).subscribe(()=>{});
            this.listDeletedEnfants = [];
            
        });
        // Add the new Enfant 
        const enfantsFormArray = this.membreForm.get('enfants') as UntypedFormArray;
        enfantsFormArray.value.forEach((enfant: Enfant)=> {
            if(!enfant.id && enfant.prenom){
                enfant.membre = this.membre;
                this._enfantService.create(enfant).subscribe((enfant)=>{
                    this.enfants.push(enfant.body);
                });
                
            } else if(enfant.id && enfant.prenom){
                const oldEnfant:Enfant = this.enfants.find(item => item.id === enfant.id);
                const index = this.enfants.findIndex(item => item.id === enfant.id);
                enfant.updatedDate = dayjs();
                this._enfantService.update(enfant).subscribe((enfant)=>{
                if (index > -1) {
                    this.enfants.splice(index, 1);
                    this.enfants.push(enfant.body);
                }
                });
            }
        });


    }

    /**
     * Delete the membre
     */
    deleteMembre(): void
    {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title  : 'Supprimer membre',
            message: 'Êtes-vous sûr de supprimer ce membre ? Cette action est irréversible!',
            actions: {
                confirm: {
                    label: 'Delete'
                }
            }
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {

            // If the confirm button pressed...
            if ( result === 'confirmed' )
            {
                // Get the current membre's id
                const id = this.membre.id;
                const idAdress = this.membre.adress ? this.membre.adress.id:null;

                // Get the next/previous membre's id
                const currentMembreIndex = this.membres.findIndex(item => item.id === id);
                const nextMembreIndex = currentMembreIndex + ((currentMembreIndex === (this.membres.length - 1)) ? -1 : 1);
                const nextMembreId = (this.membres.length === 1 && this.membres[0].id === id) ? null : this.membres[nextMembreIndex].id;

                // Delete the membre
                this._membresService.deleteMembre(id)
                    .subscribe((isDeleted) => {
                        //delete adresse
                        this._adressService.delete(idAdress).subscribe(()=>{});

                        // Return if the membre wasn't deleted...
                       // if ( !isDeleted )
                       // {
                       //     return;
                       // }

                        // Navigate to the next membre if available
                        if ( nextMembreId )
                        {
                            this.membreForm.reset;
                            if(this.membreForm.get('adress')) this.membreForm.get('adress').reset;
           
                            this._router.navigate(['../', nextMembreId], {relativeTo: this._activatedRoute});
                        }
                        // Otherwise, navigate to the parent
                        else
                        {
                            this._router.navigate(['../'], {relativeTo: this._activatedRoute});
                        }

                        // Toggle the edit mode off
                        this.toggleEditMode(false);
                    });

                // Mark for check
                this._changeDetectorRef.markForCheck();
            }
        });

    }

    /**
     * Upload avatar
     *
     * @param fileList
     */
    uploadAvatar(fileList: FileList): void
    {
        // Return if canceled
        if ( !fileList.length )
        {
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png'];
        const file = fileList[0];
        const formData = new FormData();
        formData.append('file', file, file.name); 

        // Return if the file is not allowed
        if ( !allowedTypes.includes(file.type) )
        {
            return;
        }

        // Upload the avatar
        this._membresService.uploadAvatar(this.membre.id, formData).subscribe();
    }

    /**
     * Remove the avatar
     */
    removeAvatar(): void
    {
        // Get the form control for 'avatar'
        const avatarFormControl = this.membreForm.get('avatar');

        // Set the avatar as null
        avatarFormControl.setValue(null);

        // Set the file input value as null
        this._avatarFileInput.nativeElement.value = null;

        // Update the membre
        this.membre.avatarImageLink = null;
    }


    /**
     * Add an empty phone number field
     */
    addPhoneNumberField(): void
    {
        // Create an empty phone number form group
        const phoneNumberFormGroup = this._formBuilder.group({
            country    : ['fr'],
            phoneNumber: [''],
            label      : ['']
        });

        // Add the phone number form group to the phoneNumbers form array
        (this.membreForm.get('telephones') as UntypedFormArray).push(phoneNumberFormGroup);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Remove the phone number field
     *
     * @param index
     */
    removePhoneNumberField(index: number): void
    {
        // Get form array for phone numbers
        const phoneNumbersFormArray = this.membreForm.get('telephones') as UntypedFormArray;
        console.log('phoneNumbersFormArray.at(index)' ,phoneNumbersFormArray.at(index))
        if(phoneNumbersFormArray.value[index].id) {
            this.listDeletedTelephones.push(phoneNumbersFormArray.value[index]);
            console.log('this.listDeletedTelephones',this.listDeletedTelephones);
        }
       
        // Remove the phone number field
        phoneNumbersFormArray.removeAt(index);
        

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }


    /**
     * Add an empty enfant field
     */
     addEnfantField(): void
     {
         // Create an empty enfant form group
         const enfantFormGroup = this._formBuilder.group({

            id: [null],
            prenom: [''],
            anneeNaissance: [''],
            creationDate: [dayjs()],
            updateDate: [dayjs()],
            membre: [this.membre],
         });
 
         // Add the enfant form group to the enfants form array
         (this.membreForm.get('enfants') as UntypedFormArray).push(enfantFormGroup);
 
         // Mark for check
         this._changeDetectorRef.markForCheck();
     }
 
     /**
      * Remove the enfant field
      *
      * @param index
      */
     removeEnfantField(index: number): void
     {
         // Get form array for enfants
         const enfantsFormArray = this.membreForm.get('enfants') as UntypedFormArray;
         console.log('enfantsFormArray.at(index)' ,enfantsFormArray.at(index))
         if(enfantsFormArray.value[index].id) {
             this.listDeletedEnfants.push(enfantsFormArray.value[index]);
             console.log('this.listDeletedEnfants',this.listDeletedEnfants);
         }
        
         // Remove the enfant field
         enfantsFormArray.removeAt(index);
         
 
         // Mark for check
         this._changeDetectorRef.markForCheck();
     }

    /**
     * Get country info by iso code
     *
     * @param iso
     */
    getCountryByIso(iso: string): Country
    {
        return this.countries.find(country => country.iso === iso);
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


  compareFn: ((f1: any, f2: any) => boolean) | null = this.compareByValue;

  compareByValue(f1: any, f2: any) { 
    return f1 && f2 && f1.id === f2.id; 
  }
}
