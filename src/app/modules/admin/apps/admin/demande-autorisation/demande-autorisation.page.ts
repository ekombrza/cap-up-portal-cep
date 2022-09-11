import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { ToastController } from '@ionic/angular';
import { forkJoin, map } from 'rxjs';
import { ConfirmationService } from 'src/@ekbz/services/confirmation';
import { DemandeAccesFormationPrivee } from 'src/app/models-services/demande-acces-formation-privee/demande-acces-formation-privee.model';
import { DemandeAccesFormationPriveeService } from 'src/app/models-services/demande-acces-formation-privee/demande-acces-formation-privee.service';
import { MembreService } from 'src/app/models-services/membre/membre.service';
import { IRole } from 'src/app/models-services/role/role.model';
import { RoleService } from 'src/app/models-services/role/role.service';

@Component({
  selector: 'app-demande-autorisation',
  templateUrl: './demande-autorisation.page.html',
  styleUrls: ['./demande-autorisation.page.scss'],    
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemandeAutorisationPage implements OnInit {

  roles: any[];

  @ViewChild('searchBar') searchBar ;
  public demandeAccesFormationPrivee : DemandeAccesFormationPrivee[] = [];
  public filtredDemandes : DemandeAccesFormationPrivee[] = [];
  selectedPrivateRole;

  /**
   * Constructor
   */
  constructor(
      private _demandeAccesFormationPriveeService: DemandeAccesFormationPriveeService,
      private _changeDetectorRef: ChangeDetectorRef,
      private _roleService: RoleService,
      private _membreService: MembreService,
      private _toastController: ToastController,
      private _fuseConfirmationService: ConfirmationService,
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
      forkJoin([
          this._demandeAccesFormationPriveeService.query().pipe(map((res) => res.body)),
          this._roleService.query({'typeRole.equals':'PRIVATE', 'applicationId.equals':'1'}).pipe(map(result => result.body))
        ]).subscribe(data => {
       
          this.demandeAccesFormationPrivee = data[0];
          console.log('demandeAccesFormationPrivee : ', this.demandeAccesFormationPrivee);
          this.roles = data[1];
          console.log('roles : ', this.roles);
          this.filtredDemandes = this.demandeAccesFormationPrivee;
           // Mark for check
           this._changeDetectorRef.markForCheck();
           

        });

  }

  filterItems(ev: any) {
      this.filtredDemandes = this.demandeAccesFormationPrivee;
  
      let val = ev.target.value;
      console.log("val : ", val)
      if (val) {
        this.filtredDemandes = this.demandeAccesFormationPrivee.filter(
          item => item.nomDemandeur.toLowerCase().includes(val.toLowerCase()) || item.prenomDemandeur.toLowerCase().includes(val.toLowerCase())
        );
      }
  }

  checkEsc(key:number){
      if (key == 27){  // Escape
        if (this.searchBar.value != "")
          this.searchBar.value = "";
      }
    }

    public objectComparisonFunction = function( option, value ) : boolean {
      return option.id === value.id;
    }
  
  onOpenClose(eventOpen, demandeAccesFormationPrivee: DemandeAccesFormationPrivee) {
    this._membreService.find(demandeAccesFormationPrivee.idDemandeur)
    .pipe(map((res)=>res.body))
    .subscribe((res) => {
      console.log('demandeur trouvé : ', res)
      let membre = res;
      if(eventOpen){
        this.selectedPrivateRole = membre.roles;
        this._changeDetectorRef.markForCheck();
      }
      if(!eventOpen){
          var rolesPrivateSelected: IRole[] = this.selectedPrivateRole;
          var rolesPublicSelected: IRole[] = membre.roles.filter((role) => role.typeRole === 'PUBLIC');
          let allRoles: IRole[] = [];
          membre.roles = allRoles.concat(rolesPublicSelected, rolesPrivateSelected);
          console.log('eventOpen : ',eventOpen)
          console.log('close : ', membre, membre.roles)
          this._membreService.partialUpdate(membre).subscribe(
              (membre)=>{
                  console.log('success Updated Role', membre);
          },
          (err)=> {
              console.log('error Updated Role');
          });
      }
    },
    (error) => {

    });
  }

  onSelectChange(event: MatSelectChange){
      console.log('eventChange : ',event),
      this.selectedPrivateRole = event.value;
  }
  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

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

 
  /**
 * Delete the selected demande using the form data
 */
    deleteDemande(demande:DemandeAccesFormationPrivee): void
    {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title  : 'Suppression Demande',
            message: 'Êtes-vous sûr de vouloir supprimer cette demande ? Cette action est irréversible!',
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

            this._demandeAccesFormationPriveeService.delete(demande.id)
            .subscribe(async(res)=>{
                  // Find the index of the deleted categorie
                  const index = this.demandeAccesFormationPrivee.findIndex(item => item.id === demande.id);
                  if (index > -1) {
                    this.demandeAccesFormationPrivee.splice(index, 1);
                    this._changeDetectorRef.markForCheck();
                  }
                },
                async(err)=>{
                const toast = await this._toastController.create({
                  message: 'Une erreur s\'est produite', 
                  duration: 4000
                });
                toast.present();
                });
            }
        });
    }

  
}