import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { forkJoin, map } from 'rxjs';

import { Membre } from 'src/app/models-services/membre/membre.model';
import { MembreService } from 'src/app/models-services/membre/membre.service';
import { IRole } from 'src/app/models-services/role/role.model';
import { RoleService } from 'src/app/models-services/role/role.service';

@Component({
    selector       : 'settings-team',
    templateUrl    : './team.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsTeamComponent implements OnInit
{
    roles: any[];

    @ViewChild('searchBar') searchBar ;
    public members : Membre[] = [];
    public filtredMembers : Membre[] = [];
    selectedPrivateRole;

    /**
     * Constructor
     */
    constructor(
        private membreService: MembreService,
        private _changeDetectorRef: ChangeDetectorRef,
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
        forkJoin([
            this.membreService.query().pipe(map((res) => res.body)),
            this._roleService.query({'typeRole.equals':'PRIVATE', 'applicationId.equals':'1'}).pipe(map(result => result.body))
          ]).subscribe(data => {
         
            this.members = data[0];
            console.log('membres : ', this.members);
            this.roles = data[1];
            console.log('roles : ', this.roles);
            this.filtredMembers = this.members;
             // Mark for check
             this._changeDetectorRef.markForCheck();
             

          });

    }

    filterItems(ev: any) {
        this.filtredMembers = this.members;
    
        let val = ev.target.value;
        console.log("val : ", val)
        if (val) {
          this.filtredMembers = this.members.filter(
            item => item.internalUser.firstName.toLowerCase().includes(val.toLowerCase()) || item.internalUser.lastName.toLowerCase().includes(val.toLowerCase())
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
    
    onOpenClose(eventOpen, membre: Membre) {
        if(eventOpen){
            this.selectedPrivateRole = membre.roles;
        }
        if(!eventOpen){
            var rolesPrivateSelected: IRole[] = this.selectedPrivateRole;
            var rolesPublicSelected: IRole[] = membre.roles.filter((role) => role.typeRole === 'PUBLIC');
            let allRoles: IRole[] = [];
            membre.roles = allRoles.concat(rolesPublicSelected, rolesPrivateSelected);
            console.log('eventOpen : ',eventOpen)
            console.log('close : ', membre, membre.roles)
            this.membreService.partialUpdate(membre).subscribe(
                (membre)=>{
                    console.log('success Updated Role', membre);
            },
            (err)=> {
                console.log('error Updated Role');
            });
        }
        
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
}
