import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdressService } from 'src/app/models-services/adress/adress-service';
import { Adress } from 'src/app/models-services/adress/adress.model';
import { Church } from 'src/app/models-services/church/church.model';
import { ChurchService } from 'src/app/models-services/church/church.service';
import { Membre } from 'src/app/models-services/membre/membre.model';
import { MembreService } from 'src/app/models-services/membre/membre.service';


@Component({
  selector: 'app-eglise',
  templateUrl: './eglise.page.html',
  styleUrls: ['./eglise.page.scss'],
})
export class EglisePage implements OnInit {

   connectedMembre: Membre;
   church: Church;
   adress: Adress;
   reloadInvitedTab: boolean;

  constructor(
    private membreService: MembreService,
    private churchService: ChurchService,
    private adressService: AdressService,
    private router: Router,
    private route:ActivatedRoute,
    ) {
      route.queryParams.subscribe(val => {
        // put the code from `ngOnInit` here
        console.log('Route Pzram Souscription call : ', val);
        console.log('val[reload]', val['reload']);
        if(val['reload']){
          this.reloadInvitedTab = true;
        }
      
      });
     }

  ngOnInit() {
    this.membreService.queryCurrentUser().subscribe(data => {
      this.connectedMembre = data.body;
      console.log(this.connectedMembre);
      this.churchService.find(this.connectedMembre.church.id).subscribe(data => {
        this.church = data.body;
        console.log(this.church);
        this.adressService.find(this.church.adress.id).subscribe(data => {
          this.adress = data.body;
          console.log(this.adress);
        })
      });
    }); 
  }

  isAdministrateur(){
    return this.connectedMembre?.roles.filter(role => role.name == 'Administrateur').length == 1;
   }

   dataLoadedChange(){
    this.reloadInvitedTab = false;
   }

}
